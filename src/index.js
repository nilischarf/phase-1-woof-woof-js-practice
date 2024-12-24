document.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.getElementById('dog-bar')
    const dogInfo = document.getElementById('dog-info')
    const filterButton = document.getElementById('good-dog-filter')

    let allDogs = []
    let filterGoodDogs = false

    fetch('http://localhost:3000/pups')
        .then((response) => response.json())
        .then(dogs => {
            allDogs = dogs
            displayDogs(dogs)
        })
        .catch(error => console.error('Error fetching dogs: ', error))

    function displayDogs(dogs) {
        dogBar.innerHTML=''
        dogs.forEach(dog => {
            const dogSpan = document.createElement('span')
            dogSpan.textContent = dog.name

            dogSpan.addEventListener('click', () => displayDogInfo(dog))
            dogBar.appendChild(dogSpan)
        })
    }

    function displayDogInfo(dog) {
        dogInfo.innerHTML=''
        
        const dogImage = document.createElement('img')
        dogImage.src = dog.image

        const dogName = document.createElement('h2')
        dogName.textContent = dog.name

        const dogButton = document.createElement('button')
        dogButton.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'

        dogButton.addEventListener('click', () => {
            dog.isGoodDog = !dog.isGoodDog
            dogButton.textContent = dog.isGoodDog ? 'Good Dog!' : 'Bad Dog!'

            fetch(`http://localhost:3000/pups/${dog.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isGoodDog: dog.isGoodDog },)
            })
                .then(response => response.json())
                .then(updatedDog => console.log('Updated Dog:', updatedDog))
                .catch(error => console.error('Error updating dog:', error))
        })

        dogInfo.appendChild(dogImage)
        dogInfo.appendChild(dogName)
        dogInfo.appendChild(dogButton)
    }

    filterButton.addEventListener('click', () => {
        filterGoodDogs = !filterGoodDogs
        filterButton.textContent = `Filter good dogs: ${filterGoodDogs ? 'ON' : 'OFF'}`
        
        const filteredDogs = filterGoodDogs
            ? allDogs.filter(dog => dog.isGoodDog)
            : allDogs

        displayDogs(filteredDogs)
    })
})