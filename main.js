const fs = require('fs');

class ProductDAO {
  constructor(file) {
    this.file = file;
    this.products = [];
  }
  

  loadProducts() {
    const data = fs.readFileSync(this.file, 'utf-8');
    const lines = data.trim().split('\n');
    for (const line of lines) {
      const fields = line.split(',');
      const product = {
        clave: fields[0].trim(),
        descripcion: fields[1].trim(),
        precio: parseFloat(fields[2]),
        clasificacion: fields[3].trim(),
        existencia: parseInt(fields[4]),
        existenciaMinima: parseInt(fields[5]),
        existenciaMaxima: parseInt(fields[6]),
      };
      this.products.push(product);
    }
  }

  getProducts() {
    return this.products;
  }

  countProductsByExistence(condition) {
    const count = this.products.filter(product => product.existencia >= condition).length;
    return count;
}

countProductsByExistence2(condition) {
    const count = this.products.filter(product => product.existencia <= condition).length;
    return count;
}



  getProductsByClassificationAndPrice(classification, price) {
  if (classification === null) {
    return this.products.filter(product => product.precio > price);
  } else {
    return this.products.filter(product => product.clasificacion === classification && product.precio > price);
  }
}


  getProductsByPriceRange(minPrice, maxPrice) {
    const products = this.products.filter(product => product.precio > minPrice && product.precio < maxPrice);
    return products;
  }

  countProductsByClassification() {
    const counts = {};
    for (const product of this.products) {
      if (counts[product.clasificacion] === undefined) {
        counts[product.clasificacion] = 1;
      } else {
        counts[product.clasificacion]++;
      }
    }
    return counts;
  }
  valor() {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    return new Promise((resolve) => {
      rl.question('Introduzca una clasificación: ', (valor) => {
        resolve(valor);
      });
    });
  }
  
}

async function main() {
    const productDAO = new ProductDAO('./productos.txt');
    productDAO.loadProducts();
  
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      
    });
  
    console.log("***Empresa De Abarrotes Doña Julia:***");
    console.log("1. Número de productos con existencia mayor o igual a 20.");
    console.log("2. Número de productos con existencia menor a 15.");
    console.log("3. Lista de productos con la misma clasificación y precio mayor a 15.50.");
    console.log("4. Lista de productos con precio mayor a 20.30 y menor a 45.00.");
    console.log("5. Número de productos agrupados por su clasificación.");
    console.log("Seleccione una opción del menú (1-5): ")
    rl.question('', async (option) => {
      switch (option) {
        case "1":
          const numProductsGreaterOrEqualThan20 = productDAO.countProductsByExistence(20);
          console.log(`Número de productos con existencia mayor o igual a 20: ${numProductsGreaterOrEqualThan20}`);
          break;
        case "2":
          const numProductsLessThan15 = productDAO.countProductsByExistence2(15);
          console.log(`Número de productos con existencia menor a 15: ${numProductsLessThan15}`);
          break;
        case "3":
          const classification = await productDAO.valor();
          const productsByClassificationAndPrice = await productDAO.getProductsByClassificationAndPrice(classification, 15.50);
          if (productsByClassificationAndPrice.length === 0) {
            console.log(`No se encontraron productos con la misma clasificación y precio mayor a 15.50 para la clasificación ${classification}.`);
          } else {
            console.log(`Lista de productos con la misma clasificación y precio mayor a 15.50 para la clasificación ${classification}: `, productsByClassificationAndPrice);
          };
          break;
        case "4":
          const productsByPriceRange = productDAO.getProductsByPriceRange(20.30, 45.00);
          console.log(`Lista de productos con precio mayor a 20.30 y menor a 45.00: `, productsByPriceRange);
          break;
        case "5":
          const productsByClassificationCount = productDAO.countProductsByClassification();
          console.log(`Número de productos agrupados por su clasificación: `, productsByClassificationCount);
          break;
        default:
          console.log("Opción inválida.");
          break;
      }
      rl.close();
    });
  }
  
  main();
  