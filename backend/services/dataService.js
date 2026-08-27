const formatDate = (date) => {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");


    return `${year}${month}${day}`;

};


const getDefaultDateRange = () => {

    const endDate = new Date();

    const startDate = new Date();

    startDate.setDate(
        endDate.getDate() - 6
    );


    return {

        start: formatDate(startDate),

        end: formatDate(endDate)

    };

};


module.exports = {

    formatDate,

    getDefaultDateRange

};