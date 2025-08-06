import { calculateBMI } from '../utils/bmi';
import { formatDate } from '../utils/date';

const Profile = () => {
const bmi = calculateBMI(70, 175);
return (
    <div>
    <p>BMI شما: {bmi}</p>
    <p>تاریخ: {formatDate(new Date())}</p>
    </div>
);
};

export default Profile;