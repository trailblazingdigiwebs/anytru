'use client';
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import ResponsiveHeader from '../components/responsiveHeader';
import Link from 'next/link';
import config from '../config';
import '../styles/dragAndDropUploader.css';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownSection, DropdownItem } from "@nextui-org/dropdown";
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false }); // import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; 
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dynamic from 'next/dynamic';

const CreatePost = () => {

    const [showModal, setShowModal] = useState(false);
    const [redirectUrl, setRedirectUrl] = useState('');
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [formData, setFormData] = useState({
        sku: '',
        name: '',
        description: '',
        isActive: false,
        tags: '',
        category: '',
        quantity: '',
        price: '',
        expectedDelivery: null,
    });
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelected = (selectedFile, url) => {
        setFile(selectedFile);
        setPreviewUrl(url);
    };

    const handleChange = (event, name = null) => {
        if (name) {
            // This handles the case when `handleChange` is called by ReactQuill
            setFormData({ ...formData, [name]: event });
        } else {
            const { name, value } = event.target;
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, expectedDelivery: date });
    };
    

    const handleLinkClick = (url) => {
        setRedirectUrl(url);
        setShowModal(true);
    };

    const handleAgree = () => {
        setShowModal(false);
        if (typeof document !== 'undefined') {
            window.location.href = redirectUrl;
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setRedirectUrl('');
    };
    
    // const handleChange = (event) => {
    //     const { name, value } = event.target;
    //     setFormData({ ...formData, [name]: value });
    // };

    const generateSku = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let sku = 'anytru_';
        for (let i = 0; i < 10; i++) {
            sku += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return sku;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const sku = generateSku();

        if (file) {
            const data = new FormData();
            data.append('image', file);
            data.append('sku', sku);
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('isActive', formData.isActive);
            data.append('tags', formData.tags);
            data.append('category', formData.category);
            data.append('quantity', formData.quantity);
            data.append('price', formData.price);
            data.append('dispatchDay',  formData.expectedDelivery,)

            const token = localStorage.getItem('token');

            try { 
                const response = await fetch(`${config.apiBaseUrl}/product/add`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `${token}`,
                    },
                    body: data
                });
                console.log('Response:', response);

                if (response.ok) {
                    const result = await response.json();
                    console.log('Product added successfully:', result);
                    // Reset the form fields
                    setFormData({
                        sku: '',
                        name: '',
                        description: '',
                        isActive: false,
                        tags: '',
                        category: '',
                        quantity: '',
                        price: '',
                        expectedDelivery: null,
                    });
                    setFile(null);
                    setPreviewUrl(null);
                    // Show success message
                    setShowSuccessMessage(true);
                    setTimeout(() => setShowSuccessMessage(false), 3000); // Hide after 3 seconds
                    setError(''); // Clear any previous error
                } else {
                    const errorData = await response.json();
                    console.log(errorData)
                    setError(errorData.error || 'Failed to add product');
                }
            } catch (error) {
                console.error('Error while adding product:', error);
                setError(error.message || 'An unexpected error occurred');
            }
        } else {
            setError('Please select an image to upload');
        }
    };

    const handleRemoveImage = () => {
        setFile(null);
        setPreviewUrl(null);
    };

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            // Check file size
            if (file.size > 5242880) { // 5MB in bytes
                setError('File size exceeds the limit of 5MB');
                return;
            }
    
            // Check file format
            if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
                setError('File format not supported. Please upload JPG, JPEG, or PNG files');
                return;
            }
    
            const previewUrl = URL.createObjectURL(file);
            setPreviewUrl(previewUrl);
            handleFileSelected(file, previewUrl);
        }
    }, []);
        

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxSize: 52428800, // 50MB in bytes
        accept: 'image/jpeg, image/jpg, image/png', // Accept only JPG, JPEG, and PNG files
    });

    return (
        <div>
            <ResponsiveHeader />
            <div className='pageWrapper'>
                {/* <DisclaimerModal showModal={showModal} onAgree={handleAgree} onClose={handleCancel} /> */}
                <div className="createPostWrap justify-evenly">
                    <div className='create-options'>
                        <div className='create-option-name'>
                        <Dropdown>
                            <DropdownTrigger>
                            {/* <Link href="/create-post#createPost"> */}
                                <p className='create-new'>Create New</p>
                            {/* </Link> */}
                            </DropdownTrigger>
                            <DropdownMenu className="dropdownWrapper createpost-dropdownWrapper" aria-label="Static Actions">
                                <DropdownItem key="new">  
                                    <p><strong>This feature is not available at the moment.</strong></p>
                                </DropdownItem>
                                <DropdownItem key="new">
                                      <p><small>While AnyTru is working on its Image Generator, you can use below mentioned Top Image generators or upload an AI generated image from your device</small></p>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>

                        </div>
                        <div className='create-option-name'>
                            <p><strong>Top AI Image Generators</strong></p>
                        </div>
                        <div className='ai-tools'>

                            <div className="ai-tool-wrapper flex items-center cursPointer" onClick={() => handleLinkClick('https://ideogram.ai/')}>
                                <div className='ai-tool-logo'>
                                    <img src="/images/Aitools/ideogram.jpg" alt="Ideogram" />
                                </div>
                                <div className='ai-tool-name'>
                                    <p>Ideogram</p>
                                </div>
                            </div>

                            <div className="ai-tool-wrapper flex items-center cursPointer" onClick={() => handleLinkClick('https://www.adobe.com/in/products/firefly/features/ai-art-generator.html')}>
                                <div className='ai-tool-logo'>
                                    <img src="/images/Aitools/adobe-firefly.png" alt="Adobe Firefly" />
                                </div>
                                <div className='ai-tool-name'>
                                    <p>Adobe Firefly</p>
                                </div>
                            </div>

                            <div className="ai-tool-wrapper flex items-center cursPointer" onClick={() => handleLinkClick('https://creator.nightcafe.studio/')}>
                                <div className='ai-tool-logo'>
                                    <img src="/images/Aitools/nightcafe.png" alt="NightCafe" />
                                </div>
                                <div className='ai-tool-name'>
                                    <p>NightCafe</p>
                                </div>
                            </div>

                            <div>
                                <Link href="/help/third-party-ai-disclaimer">
                                    <p className='disclaimer'><strong>Disclaimer: Third-Party AI Image Generator Tools</strong></p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <form id="createPost" onSubmit={handleSubmit} className="flex justify-evenly divTT">
                        <div>
                            <div className="drag-and-drop">
                                {!previewUrl && (
                                    <div className="upload grid items-center justify-center" {...getRootProps()}>
                                        <input {...getInputProps()} />
                                        <div className="uploadimg">
                                            <img src="/images/upload-cloud.png" alt="Upload Image" />
                                            <h2>Drag & Drop</h2>
                                        </div>
                                        <div className="uploadtext">
                                            <p>or select files from device</p>
                                            <div className='mt-8'>
                                                <p className="uploadlimit">File Format supported - jpg, jpeg, png</p>
                                                <p className="uploadlimit">Max. 5MB</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div>
                                    {previewUrl && (
                                        <div className="preview-wrapper">
                                            <button className="remove-post-image" onClick={handleRemoveImage}>Remove Image <img src="/images/cross.png"  /></button>
                                            <img src={previewUrl} alt="Preview" className="preview" />
                                        </div>
                                    )}
                                </div>
                                <p className="uploadHelpText">For best results, use high-quality images on a solid color background.</p>
                            </div>
                        </div>

                        <div className='post-details divOT'>
                            {/* <label className="block text-sm font-medium text-gray-700">
                                Product SKU
                            </label>
                            <input
                                type="text"
                                name="sku"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Please Enter SKU"
                                onChange={handleChange}
                                value={formData.sku}
                            /> */}

                            <label className="block text-sm font-medium text-gray-700">
                                Title
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Short & Crisp  (Wooden Chair, Printer Pants, Pearl Earrings)"
                                onChange={handleChange}
                                value={formData.name}
                            />

                            <label className="block text-sm font-medium text-gray-700">
                                Requirement Description
                            </label>
                            <ReactQuill
                                value={formData.description}
                                onChange={(value) => handleChange(value, 'description')}
                                placeholder="Add a description in details. (Material, look and feel)"
                            />

                            {/* <label className="block text-sm font-medium text-gray-700">
                                Price (₹)
                            </label>
                            <input
                                type="number"
                                name="price"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Please enter product price"
                                onChange={handleChange}
                                value={formData.price}
                            /> */}

                            <label className="block text-sm font-medium text-gray-700">
                                Category
                            </label>
                            <select
                                name="category"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                onChange={handleChange}
                                value={formData.category}
                            >
                                <option value="">Please Select</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Clothing">Clothing</option>
                                <option value="Prints & Graphics">Prints & Graphics</option>
                                <option value="Home_Decor">Home Decor</option>
                                <option value="Jewellery">Jewellery</option>
                                <option value="Event Setups">Event Setups</option>
                                <option value="Accessories">Accessories</option>
                                <option value="Others">Others</option>
                            </select>


                            <label className="block text-sm font-medium text-gray-700">
                                Quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Please enter product quantity"
                                onChange={handleChange}
                                value={formData.quantity}
                            />

                            <label className="block text-sm font-medium text-gray-700">
                                Expected Delivery
                            </label>
                            <DatePicker
                                selected={formData.expectedDelivery}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"  // Format for displaying date
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholderText="Select expected delivery date" // Placeholder text
                            />


                            {/* <label className="block text-sm font-medium text-gray-700">
                                Tags (comma-separated)
                            </label>
                            <input
                                type="text"
                                name="tags"
                                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Please enter tags"
                                onChange={handleChange}
                                value={formData.tags}
                            /> */}

                            {error && (
                                <div className="mt-3 mb-3 text-red-600">
                                    {error}
                                </div>
                            )}

                            <div className='create-post-button'>
                                <button type="submit" className="post-button">
                                    <img src="/images/post-plus.png" alt="Post" />
                                    <span>Post</span>
                                </button>
                            </div>

                            {showSuccessMessage && (
                                <div className="mt-3 text-green-600">
                                    Product added successfully!
                                </div>
                            )}                            

                        </div>
                    </form>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-md shadow-md text-center disclaimerModal">
                    <h2 className="text-xl font-semibold mb-4">Disclaimer</h2>
                    <p>You are about to visit a third-party site. AnyTru is not responsible for the content, accuracy, or any other aspect of the linked site. Do you agree to proceed?</p>
                    <Link href="/help/third-party-ai-disclaimer">
                        <p className='disclaimer'><strong>Read Disclaimer: Third-Party AI Image Generator Tools</strong></p>
                    </Link>
                    <div className='flex gap-2 justify-center mt-3'>
                    <button
                        className="themeBtn text-white px-4 py-2 rounded-md"
                        onClick={handleAgree}
                    >
                        I agree
                    </button>
                    <button
                        className="themeBtn text-white px-4 py-2 rounded-md"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    </div>
                </div>
                </div>
            )}
        </div>
    );
};

export default CreatePost;
