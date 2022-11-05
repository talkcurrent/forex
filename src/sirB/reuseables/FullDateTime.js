
const FullDateTime = () => {
    const dateString = new Date().toDateString();
    const timeString = new Date().toLocaleTimeString();

    const dateTime = dateString + " " + timeString;

    return dateTime;
}

export default FullDateTime
