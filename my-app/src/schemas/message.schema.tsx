import * as yup from "yup"

const messageSchema = yup.object().shape({
    username: yup.string().required("Please input your name").min(3,"Please input at least 3 characters").max(25,"Please input only 25 characters"),
    email : yup.string().required("Please input your email").email("please input in email form"),
    phonenumber : yup.string().required("Please input your phonenumber").min(8,"Please input at least 8 characters"),
    message : yup.string().required("Please input your message")
})

export {messageSchema};