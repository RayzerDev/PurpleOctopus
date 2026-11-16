module.exports = () => {
    const date = new Date().toLocaleString("fr-FR").replace(', ','-')
    
    now = `||${date}|| `
    return now
}
