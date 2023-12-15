import { search } from ".";



async function run () {
    // search('https://user-images.githubusercontent.com/81998012/210290011-c175603d-f319-4620-b886-1eaad5c94d84.jpg') 
    const { visual_matches } = await  search("https://testingimg.s3.us-west-1.amazonaws.com/sample1.png")
    
    console.log(visual_matches)
}


run()