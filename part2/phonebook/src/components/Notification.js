const Notification = ({ message }) => {
    if (message === null) {
        return null
    }
    else if ((message.includes('added')) || (message.includes('changed'))) {
        return (
            <div className='success'>
                {message}
            </div>
        )
    }
    else if (message.includes('removed')){
        return (
            <div className='error'>
                {message}
            </div>
        )
    }
}
export default Notification