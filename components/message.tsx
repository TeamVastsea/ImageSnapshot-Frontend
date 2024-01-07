import toast from "react-hot-toast";
import {Card, CardBody} from "@nextui-org/react";
import React, {ReactNode} from "react";
import {FiAlertCircle} from "react-icons/fi";
import {VscError} from "react-icons/vsc";
import {BsCheckCircle} from "react-icons/bs";

export class Message {
    static message(message: ReactNode) {
        let id = toast(<Card isPressable
                             className="bg-background dark:bg-default-100" onPress={() => {
            toast.dismiss(id)
        }}><CardBody>
            {message}
        </CardBody></Card>);
    }

    static success(message: ReactNode, icon: boolean = true) {
        let id = toast(<Card isPressable
                             className="bg-success dark:bg-success" onPress={() => {
            toast.dismiss(id)
        }}><CardBody>
            <div className="flex items-center justify-center space-x-1">
                <div>{icon ? <BsCheckCircle/> : <></>}</div>
                <div>{message}</div>
            </div>
        </CardBody></Card>);
    }

    static error(message: ReactNode, icon: boolean = true) {
        let id = toast(<Card isPressable
                             className="bg-danger dark:bg-danger" onPress={() => {
            toast.dismiss(id)
        }}><CardBody>
            <div className="flex items-center justify-center space-x-1">
                <div>{icon ? <VscError/> : <></>}</div>
                <div>{message}</div>
            </div>
        </CardBody></Card>);
    }

    static warning(message: ReactNode, icon: boolean = true) {
        let id = toast(<Card isPressable
                             className="bg-warning dark:bg-warning" onPress={() => {
            toast.dismiss(id)
        }}><CardBody>
            <div className="flex items-center justify-center space-x-1">
                <div>{icon ? <FiAlertCircle/> : <></>}</div>
                <div>{message}</div>
            </div>
        </CardBody></Card>);
    }
}
