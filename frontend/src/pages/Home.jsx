import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { link } from "react-router-dom";

function Home() {
    return (
        <div>
            {/*Section 1 */}

            <div>
                <link to={"/signup"}>
                    <div>
                        <div>
                            <p>Become an Instructor</p>
                            <FaArrowRight />
                        </div>
                    </div>

                </link>
            </div>

            {/*Section 2 */}



            {/*Section 3 */}


            {/*Footer */}
        </div>
    );
}
export default Home;