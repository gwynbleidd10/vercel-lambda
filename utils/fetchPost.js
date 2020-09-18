module.exports = {
    fetchPost
}

async function fetchPost(data, path, server = process.env.SERVER) {
    const result = await fetch(`${server}${path}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return (await result.json())
}