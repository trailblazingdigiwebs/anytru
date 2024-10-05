import React, { useState } from 'react';
import './filterPopup.css';

const FilterPopup = ({ onClose, onApplyFilters }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortDispatchDay, setSortDispatchDay] = useState('');
  
    const categoryMapping = {
        'Furniture': 'Furniture',
        'Home Decor': 'HomeDecor',
        'Graphic & Prints': 'PrintsGraphics',
        'Clothing': 'Clothing',
        'Accessories': 'Accessories',
        'Events': 'EventSetups',
        'Others': 'Others'
      };

    const handleCategoryChange = (category) => {
      // Update selected categories based on checkbox changes
      setSelectedCategories((prevSelected) => 
        prevSelected.includes(category) 
          ? prevSelected.filter((item) => item !== category) 
          : [...prevSelected, category]
      );
    };

   
    const handleDispatchTimeChange = (order) => {
        setSortDispatchDay(order === sortDispatchDay ? null : order);
      };
    
    const handleApplyFilters = () => {
        const selectedKeys = selectedCategories.map((category) => categoryMapping[category]);
        onApplyFilters(selectedKeys, sortDispatchDay); // Pass the sortDispatchDay state to parent
      };

  return (
    <div className="filter-container">
        <div className='closeDiv'>
            <button className="close-button" onClick={onClose}>
                ✖
            </button>
        </div>


        <div className="filter-popup">
          <div className="filter-header">
            <h3><strong>Filters</strong></h3>
          </div>

          <div className="filter-content">
            <div className="filter-section">
                <h4>Categories</h4>
                <div className="checkbox-group">
                {['Furniture', 'Home Decor', 'Graphic & Prints', 'Clothing', 'Accessories', 'Events', 'Others'].map((category) => (
                    <label key={category}>
                    <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category)} 
                        onChange={() => handleCategoryChange(category)} 
                    /> {category}
                    </label>
                ))}
                </div>
            </div>

            <div className="filter-section">
                <h4>Dispatch / Delivery Time</h4>
                <div className="checkbox-group">
                    {['asc', 'desc'].map((order) => (
                        <label key={order}>
                        <input 
                            type="radio" 
                            checked={sortDispatchDay === order} 
                            onChange={() => handleDispatchTimeChange(order)} 
                        /> {order === 'asc' ? 'Min to Max' : 'Max to Min'}
                        </label>
                    ))}
                </div>
            </div>


            {/* <div className="filter-section">
              <h4>Price range</h4>
              <input type="range" min="1000" max="100000" defaultValue="5000" className="slider" />
              <div className="price-values">INR 1000 - INR 1,00,000</div>
            </div> */}

            {/* <div className="filter-section">
              <h4>Dispatch Time</h4>
              <input type="range" min="1" max="60" defaultValue="10" className="slider" />
              <div className="dispatch-values">1 Day - 60 Days</div>
            </div> */}

            <div className="filter-footer">
                <button className="clear-button" onClick={() => { setSelectedCategories([]); setSortDispatchDay(''); }}>Clear All</button>
                <button className="apply-button" onClick={handleApplyFilters}>Apply</button>
            </div>
          </div>
        </div>
    </div>
  );
};

export default FilterPopup;
