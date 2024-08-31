import React, { useState, useEffect } from 'react';
import { get } from '@aws-amplify/api-rest';
import { Link } from 'react-router-dom';

interface Meal {
  mealId: string;
  title: string;
  description: string;
  price: number;
  status: string;
}

const Meals: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
  
      const response = await get({ apiName: 'api', path: '/meals' });
      const data = response.body?.items || response.response?.data; 
      setMeals(data as Meal[]);

    } catch (error) {
      console.error('Error fetching meals:', error);
    }
  };

  return (
    <div>
      {/* ... rest of your Meals component code */}
    </div>
  );
};

export default Meals;