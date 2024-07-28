import React from 'react';
import { Link} from 'react-router-dom';

interface Wheel {
    id: string;
    title: string;
    updatedAt: string;
}

const WheelCard: React.FC<Wheel> = (props) => {
    // const currentPage = useLocation().pathname;
  // console.log(props, "wheel card")

 
    return (
        <>
        <Link to={`/wheel/${props.id}`}>
        <div  key={props.id}> 
           
          {/* {wheels.id} */}
         
          <h1>{props.title}</h1>
          <h3>{props.updatedAt}</h3>
        </div>
        </Link>
        </>
    );
};

export default WheelCard;