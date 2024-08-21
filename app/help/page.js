import React from 'react';
import ResponsiveHeader from '../components/responsiveHeader';

const Help = () => {

    return (
        <div>
        <ResponsiveHeader/>
    <div className='pageWrapper'>
        <div className="flex">
            <div className='helpNavMenu w-1/4'>
                <ul>
                    <li className='selectedHelp'>Quick Start</li>
                    <li>About AnyTru</li>
                    <li>Contact Us</li>
                    <li>Features</li>
                    <li>FAQ</li>
                    <li>Blogs</li>
                    <li>Discord Community</li>
                    <li>Careers</li>
                    <li>T & C</li>
                    <li>Privacy Policy</li>
                    <li>Cancellation</li>
                    <li>Refund/Return</li>
                </ul>

            </div>        
            <div className='helpContent w-2/3'>
                <div>
                    <h1>Quickstart</h1>
                    <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.</p>

                    <img src="/images/login-screenshot.png"/>

                    <p>Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. </p>
                    <p>Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat</p>
                </div>
            </div>
        </div>
    </div>
    </div>
    )
};

export default Help;
