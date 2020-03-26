class Auth {

    // call once from App
    init(setFn) {
        this.setAllowedIn = setFn
    }

    // call from a screen to change state in App
    setAllowedIn(tf) {
        this.setAllowedIn(tf)
    }

}

export default new Auth()