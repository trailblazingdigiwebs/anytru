import React from "react";
import {Tabs, Tab, Card, CardBody} from "@nextui-org/react";
import {Checkbox} from "@nextui-org/checkbox";

const HomepageFilters = () => {
  return (
    <>
        <div className="popup-background">
            <div className="popup-content">
              <div className='popupTitleSection'>
                <h3>Filters</h3>
                {/* <span className="close-icon" onClick={togglePopup}>&times;</span> */}
              </div>
              <div className='filterPopupContent'>
                <div className="flex flex-col px-4">
                  <div className="flex w-full flex-col">
                    <Tabs aria-label="Options" isVertical="true" className='filterPopupTabs'>
                      <Tab key="photos" title="Categories" >
                        <Card>
                          <CardBody className='filterPopupTabContent'>
                            <ul>
                              <li><Checkbox color="default" size="sm">Furniture</Checkbox></li>
                              <li><Checkbox color="default" size="sm">Home Decor</Checkbox></li>
                              <li><Checkbox color="default" size="sm">Graphics & Print</Checkbox></li>
                              <li><Checkbox color="default" size="sm">Category</Checkbox></li>
                            </ul>
                          </CardBody>
                        </Card>  
                      </Tab>
                      <Tab key="music" title="Music">
                        <Card>
                          <CardBody>
                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                          </CardBody>
                        </Card>  
                      </Tab>
                      <Tab key="videos" title="Videos">
                        <Card>
                          <CardBody>
                            Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                          </CardBody>
                        </Card>  
                      </Tab>
                    </Tabs>
                  </div>
                </div>
            </div>
            </div>
        </div>
    </>
  );
};

export default HomepageFilters;