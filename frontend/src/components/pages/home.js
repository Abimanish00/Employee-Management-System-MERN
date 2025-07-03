import { Link } from "react-router-dom"
import "../styles/home.css"
export default function Home(){
    return(
        <>
        <section className="A">
        <div className=" container">
            <div className="row">
            <div className="col-lg-6">
                <p>FREE TEAM MANAGEMENT SOFTWARE</p>
                <h2>TAKE CONTROL OF YOUR
                    EVERYDAY WORK
                </h2>
                <h3>EMS helps small businesses manage their work schedules, time clocks, payroll, HR, and more.</h3>
                <button type="button"><Link to="/signup">Get Started for Free</Link> </button>
            </div>
            <div className="col-lg-6">

            </div>
            </div>
        </div>
        </section>
        </>
    )
}