const useSocket = (event, handler) => {
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;
        socket.on(event, handler);
        return () => socket.off(event, handler);
    }, [event, handler]);
};

export default useSocket;