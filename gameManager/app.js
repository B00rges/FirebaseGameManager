import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js'
import { getFirestore, collection, addDoc, serverTimestamp, doc, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js'

const firebaseConfig = {
    apiKey: 'AIzaSyBJV22HAKG1R5IV2SAr3C5WxrJiHm7d1CU',
    authDomain: 'testing-firebase-13679.firebaseapp.com',
    projectId: 'testing-firebase-13679',
    storageBucket: 'testing-firebase-13679.appspot.com',
    messagingSenderId: '647144944791',
    appId: '1:647144944791:web:24e65f6f9033e5fc8365d2',
    measurementId: 'G-0PXL45V0WC'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const collectionGames = collection(db, 'games')

const formAddGame = document.querySelector('[data-js="add-game-form"]')
const gamesList = document.querySelector('[data-js="games-list"]')
const buttonUsunb = document.querySelector('[data-js="unsub"]')

const log = (...value) => console.log(...value)

const getFormattedDate = createAt => new Intl
    .DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })
    .format(createAt.toDate())

const sanitize = string => DOMPurify.sanitize(string)

const renderGame = docChange => {
    const [id, { title, developerBy, createAt }] = [docChange.doc.id, docChange.doc.data()]

        const liGame = document.createElement('li')
        liGame.setAttribute('data-id', id)
        liGame.setAttribute('class', 'my-4')

        const h5 = document.createElement('h5')
        h5.textContent = sanitize(title)
        
        const ul = document.createElement('ul')

        const liDevelopedBy = document.createElement('li')
        liDevelopedBy.textContent = `Desenvolvido por ${sanitize(developerBy)}`

        if (createAt) {
            const liDate = document.createElement('li')
            liDate.textContent = `Adicionando no banco em ${getFormattedDate(createAt)}`
            ul.append(liDate)
        }

        const button = document.createElement('button')
        button.textContent = 'Remover'
        button.setAttribute('data-remove', id)
        button.setAttribute('class', 'btn btn-danger btn-sm')

        ul.append(liDevelopedBy)
        liGame.append(h5, ul, button)
        gamesList.append(liGame)
        
}

const rendomGamesList = snapshot => {
    if (snapshot.metadata.hasPendingWrites) {
        return
    }
    snapshot.docChanges().forEach(docChange => {
        if (docChange.type === 'removed') {
            const liGame = document.querySelector(`[data-id="${docChange.doc.id}"]`)
            liGame.remove()
            return
        }
        
        renderGame(docChange)
            
    })
}
 
 const to = promise => promise
     .then(result => [null, result])
     .catch(error => [error])

 const addGame = async e => {
    e.preventDefault()
    
    const [error, doc]  = await to( addDoc(collectionGames, {
        title: sanitize(e.target.title.value),
        developerBy: sanitize(e.target.developer.value),
        createAt: serverTimestamp()
    }))

    if (error) {
        return error
    }

    log(`Document criado com o ID`, doc.id)
    e.target.reset()
    e.target.title.focus()

}

const deleteGame = async e => {
    const idRemoveButton = e.target.dataset.remove
    
    if (!idRemoveButton) {
        return
    }
    
    const [error] = await to(deleteDoc(doc(db, 'games', idRemoveButton)))

    if (error) {
      return log(error)
    }

    log('Game removido')
}

const handleSnapshotError = e => log(e)

const unsubscribe = onSnapshot(collectionGames, rendomGamesList, handleSnapshotError)
formAddGame.addEventListener('submit', addGame)
gamesList.addEventListener('click', deleteGame)
buttonUsunb.addEventListener('click', unsubscribe)