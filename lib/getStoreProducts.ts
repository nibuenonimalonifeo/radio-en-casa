import fs from 'fs';
import path from 'path';

export interface Product {
  id: string;
  title: string;
  category: string;
  price: string;
  img: string;
  tag: string;
  sizes: string;
}

export function getStoreProducts(): Product[] {
  try {
    const dirPath = path.join(process.cwd(), 'tienda');
    
    // Si la carpeta no existe, devuelve una lista vacía
    if (!fs.existsSync(dirPath)) {
      return [];
    }

    const filenames = fs.readdirSync(dirPath);

    const products = filenames
      .filter((file) => file.endsWith('.json'))
      .map((file) => {
        const filePath = path.join(dirPath, file);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        return {
          id: data.id || file.replace('.json', ''),
          title: data.title || 'PRODUCTO REC',
          category: data.category || 'INDUMENTARIA',
          price: data.price || '$0',
          img: data.img || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
          tag: data.tag || 'REC ORIGINAL',
          sizes: data.sizes || 'TALLE ÚNICO',
        };
      });

    return products;
  } catch (error) {
    console.error('Error leyendo los productos de la carpeta tienda:', error);
    return [];
  }
}