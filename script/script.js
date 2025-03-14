const removeActiveClass = () => {
    const activeButton = document.querySelectorAll('.active');
    for(let btn of activeButton) {
        btn.classList.remove('active')
    }
}

const loadCategories = async () => {
    try {     
        const response =await fetch('https://openapi.programming-hero.com/api/phero-tube/categories');
        const data =await response.json();
        displayCategories(data.categories)
    } 
    catch (error) {
        console.log(`Error is here: ${error}`)
    }
};

const displayCategories = categories => {
    const categoryContainer = document.getElementById('category-container');
    for(let cat of categories) {
        const div = document.createElement('div');
        div.innerHTML = `
        <button id="btn-${cat.category_id}" onclick="loadCategoryVideo(${cat.category_id})" class="btn text-[#25252570] hover:bg-red-700 hover:text-white">${cat.category}</button>
        `;
        categoryContainer.append(div)
    }
}

const loadVideoDetails = id => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${id}`;
    fetch(url)
    .then(res => res.json())
    .then(data => showVideoDetails(data.video));
};
const showVideoDetails = video => {
    document.getElementById('video_details').showModal();
    document.getElementById('details-container').innerHTML = `
    <img class="rounded h-3/4 mx-auto object-cover" src="${video.thumbnail}">
    <h2 class="text-xl font-bold mt-4">
    <span class="font-normal">Title: </span> ${video.title}
    </h2>
    <p class="mt-4 text-base font-medium">
    ${video.description}
    </p>
    `
}

const loadVideo = (searchText = "") => {
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(res => res.json())
    .then(data => {
        removeActiveClass();
        document.getElementById('show-all-content').classList.add('active')
        showVideo(data.videos)
    }) 
}
const showVideo = (videos) => {
    const videoSection = document.getElementById('main-container');
    videoSection.innerHTML = '';
    if(videos.length == 0){
        videoSection.innerHTML = `
         <div class="flex flex-col justify-center items-center h-[70vh]">
                <img src="Icon.png" alt="">
                <h2 class="text-2xl font-bold text-center">
                    Oops!! Sorry, There is no content here
                </h2>
            </div>
        `;

        return
    }
        for(let video of videos) {
        let postedDateTime = video.others.posted_date;
        let getHours = Math.floor(postedDateTime / 3600);
        let getMinutes = Math.floor((postedDateTime % 3600) / 60);
        const div = document.createElement('div');
       
        div.classList.add("h-[325px]", "border-b-1", "border-[#25252520]","mt-6", "mb-4");
        div.innerHTML =`
               <div class="w-full h-[200px] relative">
                    <img class="h-full w-full rounded-lg object-cover" src="${video.thumbnail}" alt="">
                    <p class="absolute right-6 bottom-6 text-[10px] text-white bg-black py-1 px-1.25 rounded">${getHours}hrs ${getMinutes} min ago</p>
                </div>
                <!-- Details -->
                <div class="flex mt-5 gap-5">
                    <!-- User image -->
                    <img class="h-[40px] w-[40px] rounded-full object-cover
                    " src="${video.authors[0].profile_picture}" alt="">
                    <div>
                        <!-- Description -->
                        <p class="text-base font-bold">
                            ${video.title}
                        </p>
                        <div class="flex gap-2 items-center mt-2">
                            <h5 class="text-sm font-normal text-[#17171770]">
                                ${video.authors[0].profile_name}
                            </h5>
                            ${
                                video.authors[0].verified == true
                                  ? `<img
                                class="w-5 h-5"
                                src="https://img.icons8.com/?size=96&id=98A4yZTt9abw&format=png"
                                alt=""
                              />`
                                  : ``
                              }
                        </div>
                        <h6 class="text-sm font-normal text-[#17171770] mt-2.5">
                            ${video.others.views} views
                        </h6>
                    </div>
                </div>
                <button onclick=loadVideoDetails('${video.video_id}') class="btn btn-block mt-2">Show details</button>
        `;
        videoSection.append(div)
    };
};

const loadCategoryVideo = (id) => {
    const url = `https://openapi.programming-hero.com/api/phero-tube/category/${id}`
    fetch(url)
    .then(res => res.json())
    .then(data => {
        removeActiveClass()
        const buttons = document.getElementById(`btn-${id}`);
        buttons.classList.add('active')
        showVideo(data.category)})
}


document.getElementById('search-input').addEventListener('keyup', e => {
    const input = e.target.value;
    loadVideo(input)
})
loadCategories();
// loadVideo()