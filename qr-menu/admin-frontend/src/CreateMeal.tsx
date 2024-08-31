import React, { useState } from 'react';
import { post } from '@aws-amplify/api-rest';
import { useNavigate } from 'react-router-dom';

const CreateMeal: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await post({
        path: '/meals',
        requestBody: {
          title,
          description,
          price: parseFloat(price),
          imageUrl,
          status: 'enabled',
        },
      });
      navigate('/meals');
    } catch (error) {
      console.error('Error creating meal:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... rest of your form code */}
    </form>
  );
};

export default CreateMeal;