const orderArrayRandomly = array => array?.sort(() => Math.random() - 0.5)

const  generateRandomString = (lenght) => {
    const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result1= Math.random().toString(36).substring(0,lenght);       

    return result1;
}