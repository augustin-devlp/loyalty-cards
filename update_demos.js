const fs = require('fs');

const demos = {
  "cafe-lumiere.html": {
    name: "Café Lumière — Torréfaction Artisanale",
    colors: { bg: "#FAF8F5", dark: "#2C1810", gold: "#C9A84C" },
    heroImg: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=1200&q=80",
    services: [
      { name: "Espresso", price: "CHF 4.50" },
      { name: "Flat White", price: "CHF 6.00" },
      { name: "Cold Brew", price: "CHF 7.50" },
      { name: "Café de spécialité du jour", price: "CHF 5.50" },
      { name: "Thé de cérémonie", price: "CHF 6.50" },
      { name: "Pâtisserie maison", price: "CHF 5.00" }
    ]
  },
  "boulangerie-martin.html": {
    name: "Martin — Boulangerie Artisanale",
    colors: { bg: "#F5EDD6", dark: "#1A1A1A", gold: "#1d9e75" },
    heroImg: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    services: [
      { name: "Baguette tradition", price: "CHF 2.80" },
      { name: "Pain de campagne au levain", price: "CHF 6.50" },
      { name: "Croissant pur beurre", price: "CHF 3.50" },
      { name: "Pain aux noix et figues", price: "CHF 8.00" },
      { name: "Kouign-amann", price: "CHF 5.00" },
      { name: "Éclair au chocolat Valrhona", price: "CHF 7.00" }
    ]
  },
  "black-scissors.html": {
    name: "Black Scissors — Grooming Studio",
    colors: { bg: "#F5F0E8", dark: "#1C1C1C", gold: "#C9A84C" },
    heroImg: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
    services: [
      { name: "Coupe signature", price: "CHF 65" },
      { name: "Coupe + Barbe sculptée", price: "CHF 95" },
      { name: "Rasage au rasoir droit", price: "CHF 75" },
      { name: "Soin barbe premium", price: "CHF 45" },
      { name: "Coupe enfant", price: "CHF 45" }
    ]
  },
  "bistrot-du-coin.html": {
    name: "Le Comptoir — Brasserie Gastronomique",
    colors: { bg: "#FAF8F5", dark: "#1A3A2A", gold: "#C9A84C" },
    heroImg: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
    services: [
      { name: "Tartare de bœuf wagyu", price: "CHF 38" },
      { name: "Saint-Jacques poêlées", price: "CHF 42" },
      { name: "Filet de veau, jus de truffe", price: "CHF 58" },
      { name: "Risotto aux cèpes", price: "CHF 36" },
      { name: "Menu dégustation 4 plats", price: "CHF 95" }
    ]
  },
  "nail-studio.html": {
    name: "Atelier Rose — Nail & Beauty Studio",
    colors: { bg: "#F9F0F0", dark: "#1A1A1A", gold: "#C9A84C" },
    heroImg: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=1200&q=80",
    services: [
      { name: "Pose gel complète", price: "CHF 95" },
      { name: "Remplissage gel", price: "CHF 65" },
      { name: "Nail art signature", price: "CHF 120" },
      { name: "Manucure japonaise", price: "CHF 75" },
      { name: "Soin mains premium", price: "CHF 55" }
    ]
  }
};

const dirs = ['public/demos', 'public'];

for (const dir of dirs) {
  for (const [file, data] of Object.entries(demos)) {
    const filePath = dir + '/' + file;
    if (!fs.existsSync(filePath)) {
       console.log('Skipping ' + filePath);
       continue;
    }
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Title
    content = content.replace(/<title>.*?<\/title>/, "<title>" + data.name + " — Stampify</title>");
    content = content.replace(/<a href="#" class="nav-logo">.*?<\/a>/, "<a href='#' class='nav-logo'>" + data.name.split('—')[0].trim() + "</a>");
    
    // Vars
    content = content.replace(/--brown:\s*#[a-fA-F0-9]+;/g, "--brown: " + data.dark + ";");
    content = content.replace(/--cream:\s*#[a-fA-F0-9]+;/g, "--cream: " + data.bg + ";");
    content = content.replace(/--gold:\s*#[a-fA-F0-9]+;/g, "--gold: " + data.gold + ";");
    content = content.replace(/--bg:\s*#[a-fA-F0-9]+;/g, "--bg: " + data.bg + ";");
    content = content.replace(/--primary:\s*#[a-fA-F0-9]+;/g, "--primary: " + data.gold + ";");

    // Replace images
    content = content.replace(/background-image:\s*url\('[^']+'\)/g, "background-image:url('" + data.heroImg + "')");
    content = content.replace(/<img src="https:\/\/images\.unsplash\.com[^"]+"/g, "<img src=\"" + data.heroImg + "\"");
    content = content.replace(/content="https:\/\/images\.unsplash\.com[^"]+"/g, "content=\"" + data.heroImg + "\""); // For OG image

    let servicesHtml = '<div class="reveal"><h3 class="carte-cat-title">Nos Prestations</h3>';
    for (const s of data.services) {
      servicesHtml += '<div class="carte-ligne" onclick="document.getElementById(\\'reservation\\').scrollIntoView({behavior:\\'smooth\\'})"><span class="carte-item-name">' + s.name + '</span><span class="carte-item-price">' + s.price + '</span></div>';
    }
    servicesHtml += '</div>';

    // Services
    content = content.replace(/<div class="carte-categories">[\s\S]*?<\/div>\s*<\/div>\s*<\/section>/, 
      '<div class="carte-categories">' + servicesHtml + '</div></div></section>'
    );

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated ' + filePath);
  }
}
