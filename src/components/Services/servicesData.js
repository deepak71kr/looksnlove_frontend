// src/components/Services/servicesData.js
import api from '../../api/api';

// Default image path
const DEFAULT_IMAGE = '/categories_images/combo_services.jpg';

// Function to generate image path based on category name
const getCategoryImage = (categoryName) => {
  try {
    // Convert category name to lowercase and replace spaces with underscore
    const imageName = categoryName.toLowerCase().replace(/\s+/g, '_');
    
    // For categories that end with "service", add "s" to make it "services"
    const finalImageName = imageName.endsWith('_service') 
      ? imageName + 's' 
      : imageName;

    const imagePath = `/categories_images/${finalImageName}.jpg`;
    console.log('Generated image path for', categoryName, ':', imagePath);
    return imagePath;
  } catch (error) {
    console.error('Error generating image path:', error);
    return DEFAULT_IMAGE;
  }
};

export const fetchServicesData = async () => {
  try {
    console.log('Making API request to /categories');
    const response = await api.get('/categories');
    console.log('API Response:', response.data);
    
    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid response format:', response.data);
      return [];
    }

    const categories = response.data;
    console.log('Processing categories:', categories);

    // Ensure we have valid data before processing
    if (!categories || categories.length === 0) {
      console.log('No categories found in response');
      return [];
    }

    const processedCategories = categories.map(category => {
      // Ensure category has required fields
      if (!category.name || !category.services) {
        console.warn('Invalid category data:', category);
        return null;
      }

      const categoryData = {
        category: category.name,
        image: getCategoryImage(category.name),
        subcategories: category.services.map(service => ({
          _id: service._id,
          name: service.name || 'Unnamed Service',
          price: service.price || 0,
          description: service.description || 'No description available',
          images: service.images || []
        })).filter(service => service.name !== 'Unnamed Service')
      };

      console.log('Processed category data:', categoryData);
      return categoryData;
    }).filter(Boolean);

    // Sort categories to put combo packages at the top
    const sortedCategories = processedCategories.sort((a, b) => {
      const isComboA = a.category.toLowerCase().includes('combo') || 
                       a.category.toLowerCase().includes('basic') ||
                       a.category.toLowerCase().includes('regular') ||
                       a.category.toLowerCase().includes('premium');
      const isComboB = b.category.toLowerCase().includes('combo') || 
                       b.category.toLowerCase().includes('basic') ||
                       b.category.toLowerCase().includes('regular') ||
                       b.category.toLowerCase().includes('premium');
      
      if (isComboA && !isComboB) return -1;
      if (!isComboA && isComboB) return 1;
      
      // If both are combo packages, sort by name
      if (isComboA && isComboB) {
        const order = { 'basic': 1, 'regular': 2, 'premium': 3, 'combo': 4 };
        const getOrder = (name) => {
          const lowerName = name.toLowerCase();
          for (const [key, value] of Object.entries(order)) {
            if (lowerName.includes(key)) return value;
          }
          return 5;
        };
        return getOrder(a.category) - getOrder(b.category);
      }
      
      return 0;
    });

    console.log('Final processed categories:', sortedCategories);
    return sortedCategories;
  } catch (error) {
    console.error('Error fetching services data:', error.response || error);
    throw error; // Re-throw to handle in the component
  }
};
