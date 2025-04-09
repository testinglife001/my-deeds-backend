
export const article_validator = (data, file) => {

    const { title, category, slug, tag, text } = data;
    
    // console.log(title);   
    let error = {

    };

    // if(!title && title.length === 0){
    //    error.title = 'Please enter article title';
    // }

    if(!title){
        error.title = 'Please enter article title';
    }
    if(!category){
        error.category = 'Please enter article category';
    }
    if(!slug){
        error.slug = 'Please enter article slug';
    }
    if(!tag){
        error.tag = 'Please enter article tag';
    }
    if(!text){
        error.text = 'Please enter article text';
    }

    if(file) {
        if(Object.keys(file).length === 0){
            error.image = 'Please upload article image';
        }
    }

    if(Object.keys(error).length  === 0){
        return {
            validated: true
        }
    }else{
        return {
            validated: false,
            error: error
        }
    }

}


