import React from 'react';
import {Switch} from "@nextui-org/switch";
import ResponsiveHeader from '../components/responsiveHeader';

const EditSellerProfile = () => {

    return (
        <div>
        <ResponsiveHeader/>
    <div className='pageWrapper'>

    <div className='flex'>
        <div className='profile-details w-1/3'> 
            <div className='profile-details-wrapper'>
                <img className="profile-pic" src="/images/profile-pic.png" alt="Post" />
                <div>
                    <p className='profile-name'>Vineeta Joseph</p>
                    <p className='profile-username'>@Vin.Jos40</p>

                    <div className='flex'>
                    <p>102 Following</p>
                    <p>62 Followers</p>
                    <p>12 Posts</p>
                    </div>

                    <div>
                        <p>Bio</p>
                        <p>Product designer, passed out from Pearl Academy. Posting designs for all categories at AnyTru</p>
                    </div>

                    <div>
                        <a href="#"><p>My Orders</p></a>
                    </div>

                    <div className='flex'>
                        <p>Switch To Creator Account</p>
                        <Switch defaultSelected aria-label="Automatic updates"/>
                    </div>
                    <p>You can switch to Creator Account once you have achieved 50 likes on 20 posts.</p>
                    <div className='flex'>
                        <p>Switch To Seller Account</p>
                        <Switch/>
                    </div>

                </div>
            </div>
        </div>
        <div className='edit-profile-details w-2/3'> 
                <p className='mb-10'>Submit Request As Vendor</p>

                <form>
                    <div className='mb-24'>
                    <div className='flex justify-end gap-4'>
                        <div className='w-1/2'>
                            <label className="block text-sm font-medium text-gray-700">
                            Contact Person
                            </label>
                            <input type="text" 
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Full Name"
                            />
                        </div>
                    </div>
                    
                    <div className='flex gap-4'>
                        <div className='w-1/2'>
                            <label className="block text-sm font-medium text-gray-700">
                            Company Name
                            </label>
                            <input type="text" 
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Company Name"
                            />
                        </div>

                        <div className='w-1/2'>
                            <label className="block text-sm font-medium text-gray-700">
                            Contact Number
                            </label>
                            <input type="text" 
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Contact Number"
                            />
                        </div>
                    </div>
                    </div>

                    <label className="block text-sm font-medium text-gray-700">
                    Change Email
                    </label>
                    <input type="text" 
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Mehrabbozorgi.business@gmail.com"
                    />
                    
                    <label className="block text-sm font-medium text-gray-700">
                    Address
                    </label>
                    <input type="text" 
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="33062 Zboncak isle"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                    Contact Number
                    </label>
                    <input type="text" 
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="9555118077"
                    />

                    <div className='flex gap-4'>
                        <div className='w-1/2'>
                            <label className="block text-sm font-medium text-gray-700">
                            City
                            </label>
                            <input type="text" 
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Mehrab"
                            />
                        </div>
                        <div className='w-1/2'>
                            <label className="block text-sm font-medium text-gray-700">
                            State
                            </label>
                            <input type="text" 
                            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Bozorgi"
                            />
                        </div>
                    </div>


                    <label className="block text-sm font-medium text-gray-700">
                    Change Password
                    </label>
                    <input type="text" 
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="*********"
                    />

                </form>

                <div className="flex gap-4 mt-10">
                    <button className="edit-cancel-btn edit-btns">    
                        <span>Cancel</span>
                    </button>    
                    <button className="edit-save-btn edit-btns">    
                        <span>Save</span>
                    </button>    

                </div>

        </div>

    </div>

    </div>
    </div>
    )
};

export default EditSellerProfile;
