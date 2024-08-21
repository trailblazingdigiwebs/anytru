import React from "react";


const VendorDetails = () => {
  return (
    <>
        <div className="flex vendorDetailsWrapper" >
            <div className="vendorProfilePic">
                <img src="/images/vendors/vendor-profile-pic.png" />
            </div>
            <div className="vendorProfileDetails">
                <div className="flex items-center gap-10" >
                    <h2>Modern_furniture.CHD</h2>
                    <button className="followPostBtn">
                        <span>Follow</span>
                    </button>
                </div>
                <div className="vendorProfileContent">
                    <p className="flex gap-1">Vendor Rating: <img src="/images/rating.png" className="rating-star"/><span> 4.2</span></p>
                    <p>Price Per Piece: <span> INR 20,000</span></p>
                    <p>Dispatch Time: <span> 8 Days</span></p>
                    <p>Location: <span> Chandigarh</span></p>
                    <p>More Products: <span> 26</span></p>
                    <p>Remarks: Can create similar chair in saagun wood with rexine / leather. </p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="placeOrderBtn followPostBtn">
                        <span>Place Order</span>
                    </button>
                </div>
            </div>
        </div>
    </>
  )
}

export default VendorDetails;