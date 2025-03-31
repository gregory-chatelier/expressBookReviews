const axios = require('axios');

const fetchBooksByTitle = async (query) => {
    
    try {
        const response = await axios.get(`http://localhost:5000/title/${query}`);
        return JSON.stringify(response.data, null, 4);
    } catch (error) {
        console.error(error);
        return {'error': 'Failed to fetch book details.'};
    }
}

(async () => { 
    try {
        const result = await fetchBooksByTitle("Gilga");
        console.log(result);
    } catch (error) {
        console.error(error);
    }
})();