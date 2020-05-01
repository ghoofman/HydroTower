module.exports = {
    Timespan: (date1, date2) => {
        var diff = date2.getTime() - date1.getTime();

        var days = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * (1000 * 60 * 60 * 24);

        var hours = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * (1000 * 60 * 60);

        var mins = Math.floor(diff / (1000 * 60));
        diff -= mins * (1000 * 60);

        var seconds = Math.floor(diff / (1000));
        diff -= seconds * (1000);

        return {
            days,
            hours,
            mins,
            seconds
        }
    }
}