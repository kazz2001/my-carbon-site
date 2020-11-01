exports.onCreatePage = async ({ page, actions }) => {
    const { createPage } = actions
    if (page.path.match(/^\/users/)) {
        page.matchPath = "/users/*"
        createPage(page)
    }
}