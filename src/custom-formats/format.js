import moment from "moment";



export const firstLetterUpper = (user = {}) => {
    const fname = user?.firstname?.length ? user.firstname[0].toUpperCase() + user.firstname.slice(1).toLowerCase() : '';
    const lname = user?.lastname?.length ? user.lastname[0].toUpperCase() + user.lastname.slice(1).toLowerCase() : '';
    return `${fname} ${lname}`.trim();
};
export const shortNameUpper = (user = {}) => {
    const fname = user?.firstname?.length ? user.firstname[0].toUpperCase() : "";
    const lname = user?.lastname?.length ? user.firstname[0].toUpperCase() : "";
    return `${fname}${lname}`.trim();
};

export const formatTime = (timestamp) => {

    if (!timestamp) return "";
    const now = moment();
    const inputTime = moment(timestamp);
    // Invalid date check
    if (!inputTime.isValid()) return "Invalid date";
    const minutesDiff = now.diff(inputTime, "minutes"); 
    const daysDiff = now.diff(inputTime, "days");
    // Less than 1 minute ago
    if (minutesDiff < 1) {
        return "Just now";
    }
    // Less than 1 hour
    if (minutesDiff < 60) {
        return `${minutesDiff} min${minutesDiff > 1 ? "s" : ""} ago`;
    }
    // Today
    if (daysDiff === 0) {
        return `Today at ${inputTime.format("hh:mm A")}`;
    }
    // Yesterday
    if (daysDiff === 1) {
        return `Yesterday at ${inputTime.format("hh:mm A")}`;
    }
    // This year
    if (now.year() === inputTime.year()) {
        return inputTime.format("MMM D [at] hh:mm A");
    }
    // Older messages
    return inputTime.format("MMM D, YYYY [at] hh:mm A");
};  

export const dateTimeFormat = (obj, format)=>{
    if(format === 'hh:mm A'){
        return moment(obj?.lastMessage?.createdAt).format(format);
    }else if (format === 'MMM DD, YYYY') {
        return moment(obj?.createdAt).format(format);
    } else {
        
    }
};