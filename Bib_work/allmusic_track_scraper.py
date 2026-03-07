#!/usr/bin/env python3
"""
AllMusic Track Listing Scraper
AllMusicのアルバムページからトラックリストとComposer情報を取得し、HTMLテーブルを生成します。
"""

import json
import re
import urllib.request
import time
import sys
import os

def convert_duration(duration):
    """PT00H02M34S形式から2:34形式に変換"""
    match = re.search(r'PT00H(\d+)M(\d+)S', duration)
    if match:
        minutes = int(match.group(1))
        seconds = match.group(2)
        return f"{minutes}:{seconds}"
    return duration

def get_composer(url):
    """各曲のページからComposer情報を取得"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            html = response.read().decode('utf-8')
            
        # Composer情報を抽出
        composer_match = re.search(r'<div class="composer">(.*?)</div>\s*</div>', html, re.DOTALL)
        if composer_match:
            composer_section = composer_match.group(1)
            # 各作曲者の名前を抽出
            composers = re.findall(r'<a[^>]*>([^<]+)</a>', composer_section)
            if composers:
                return ' / '.join(composers)
        return "Unknown"
    except Exception as e:
        print(f"エラー ({url}): {e}", file=sys.stderr)
        return "Unknown"

def fetch_album_page(album_url):
    """アルバムページのHTMLを取得"""
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        req = urllib.request.Request(album_url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.read().decode('utf-8')
    except Exception as e:
        print(f"アルバムページの取得に失敗しました: {e}", file=sys.stderr)
        sys.exit(1)

def extract_tracks(html):
    """HTMLからトラック情報を抽出"""
    tracks_match = re.search(r'"tracks":\s*\[(.*?)\]', html, re.DOTALL)
    if not tracks_match:
        print("トラック情報が見つかりませんでした", file=sys.stderr)
        sys.exit(1)
    
    tracks_json = '[' + tracks_match.group(1) + ']'
    return json.loads(tracks_json)

def generate_html_table(track_data, album_title="Album"):
    """HTMLテーブルを生成"""
    html_output = f'''<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>{album_title} - Track Listing</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
        .t3-p {{
            border-collapse: collapse;
            width: 100%;
        }}
        .t3-p td {{
            border: 1px solid #ccc;
            padding: 8px;
        }}
        .t3-p tr:first-child {{
            background-color: #f0f0f0;
            font-weight: bold;
        }}
        .header1 {{
            background-color: #333;
            color: white;
            padding: 10px;
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <table>
        <tr>
            <td colspan="5" class="header1">Tracks</td>
        </tr>
        <tr>
            <td colspan="5">
                <table class="t3-p">
                    <tbody>
                        <tr>
                            <td>No.</td>
                            <td>Title</td>
                            <td>Composer</td>
                            <td>Performer</td>
                            <td>Time</td>
                        </tr>
'''
    
    # 各トラックを追加
    for track in track_data:
        html_output += f'''                        <tr>
                            <td align="right">{track['no']}</td>
                            <td>{track['title']}</td>
                            <td>{track['composer']}</td>
                            <td>{track['performer']}</td>
                            <td>{track['duration']}</td>
                        </tr>
'''
    
    html_output += '''                    </tbody>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>'''
    
    return html_output

def main():
    """メイン処理"""
    # コマンドライン引数のチェック
    if len(sys.argv) < 2:
        print("使用方法: python3 allmusic_track_scraper.py <AllMusic Album URL> [output_file.html]")
        print("例: python3 allmusic_track_scraper.py https://www.allmusic.com/album/addison-mw0004526525")
        sys.exit(1)
    
    album_url = sys.argv[1]
    output_file = sys.argv[2] if len(sys.argv) > 2 else "track_listing.html"
    
    print(f"アルバムページを取得中: {album_url}")
    html = fetch_album_page(album_url)
    
    print("トラック情報を抽出中...")
    tracks = extract_tracks(html)
    
    # アルバムタイトルとアーティスト名を抽出
    album_title_match = re.search(r'<title>([^<]+)</title>', html)
    album_title = album_title_match.group(1).split('|')[0].strip() if album_title_match else "Album"
    
    # パフォーマー名を抽出（最初のトラックから）
    performer = "Unknown"
    if tracks:
        first_track_url = tracks[0]['url']
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            req = urllib.request.Request(first_track_url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                track_html = response.read().decode('utf-8')
                performer_match = re.search(r'<div class="performer">.*?<a[^>]*>([^<]+)</a>', track_html, re.DOTALL)
                if performer_match:
                    performer = performer_match.group(1)
        except:
            pass
    
    print(f"\n各曲のComposer情報を取得中（全{len(tracks)}曲）...")
    track_data = []
    
    for i, track in enumerate(tracks, 1):
        title = track['name'].replace('&', '&')
        duration = convert_duration(track['duration'])
        url = track['url']
        
        print(f"{i}/{len(tracks)}: {title}")
        composer = get_composer(url)
        
        track_data.append({
            'no': i,
            'title': title,
            'composer': composer,
            'performer': performer,
            'duration': duration
        })
        
        # レート制限を避けるため少し待機
        if i < len(tracks):
            time.sleep(1)
    
    print("\nHTMLテーブルを生成中...")
    html_output = generate_html_table(track_data, album_title)
    
    # ファイルに保存
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(html_output)
    
    print(f"\n✓ HTMLファイルを作成しました: {output_file}")
    print(f"\n=== トラックリスト（全{len(track_data)}曲）===")
    for track in track_data:
        print(f"{track['no']:2d}. {track['title']}")
        print(f"    Composer: {track['composer']}")
        print(f"    Duration: {track['duration']}")

if __name__ == "__main__":
    main()

# Made with Bob
