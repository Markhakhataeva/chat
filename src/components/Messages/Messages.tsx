import React, {FC, useEffect, useState} from 'react';
import {useTypedDispatch} from "../../hooks/useTypedDispatch";
import {useParams} from "react-router";
import {useTypedSelector} from "../../hooks/useTypedSelector";
import {getMessages} from "../../redux/Messages/MessagesSlice";
import {Form} from "../Form/Form";
import styles from '../../styles/Message.module.scss';



interface MessageProps {
    id: number
    message_id: number;
    user_id: number;
    recipient_id: number;
    timestamp: string;
    message: string;
}

interface UserProps {
    id: number;
    username: string;
}


export const Messages:FC = () => {
    const dispatch = useTypedDispatch();
    const { id: chatId } = useParams<{ id: string }>();
    const messages = useTypedSelector(state => state.messages.messages as MessageProps[]);
    const users = useTypedSelector(state => state.users.users as UserProps[]);

    const [text, setText] = useState<string>("");

    const messageId = messages.map(x => x.id).join(' ');

    useEffect(() => {
        dispatch(getMessages());
    }, [dispatch]);


    const currentUserId = 9;

    const myName = users.find((x) => x.id === currentUserId)?.username;
    const userChat = users.find((x) => x.id === parseInt(chatId!))


    const messageChat = messages
        .filter((mes) =>
            (mes.user_id === currentUserId && mes.recipient_id === parseInt(chatId!))||
            ( mes.user_id === parseInt(chatId!) && mes.recipient_id === currentUserId)
        )
        .sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())


    return (
        <div>
            <div className={styles.name}>
                {userChat?.username}
            </div>

            <div className={styles.chat}>
                {messageChat.map((message) =>
                    <div  className={message.user_id === currentUserId ? styles.my_mess : styles.user_mess}>
                        <div className={styles.user_name}>
                            <b>from:{message.user_id === currentUserId ? myName : userChat?.username}</b>
                        </div>
                        <p>{message.message}</p>
                        <div className={styles.time}>{message.timestamp}</div>
                    </div>
                )}
            </div>

            <Form text={text} setText={setText} chatId={chatId} messageId={messageId}/>

        </div>
    )
}