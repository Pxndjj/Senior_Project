"use client";

import React, { useEffect, useState } from 'react';
import Map from './Map';

const DynamicMapClient = ({ restaurants }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <div className='mb-6'>
      <Map restaurants={restaurants} />
    </div>
  );
};

export default DynamicMapClient;
