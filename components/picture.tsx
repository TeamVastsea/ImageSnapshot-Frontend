import React, {useEffect, useRef, useState} from "react";
import {
    Card,
    CardFooter,
    Image,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Selection,
    useDisclosure
} from "@nextui-org/react";
import {getImgContrast} from 'react-img-contrast';
import copy from "copy-to-clipboard";
import {CheckLinearIcon, DeleteIcon} from "@nextui-org/shared-icons";
import {Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/modal";
import {Message} from "@/components/message";
import {FiCopy} from "react-icons/fi";
import {Input} from "@nextui-org/input";
import {PictureAPI} from "@/interface/pictureAPI";
import {SERVER_URL} from "@/interface/api";
import {PriceInfo} from "@/components/price";
import IOC from "@/providers";
import {Button, ButtonGroup} from "@nextui-org/button";

const SharedButton = (props: { link: string, pid?: string, className?: string }) => {
    const {link, pid} = props;
    const [isChecked, setIsChecked] = useState(false);
    let timeout: NodeJS.Timeout | null = null;
    return (
        <Button isIconOnly className="justify-center"
                variant="bordered" size="sm"
                onClick={() => {
                    if (!link && pid) {
                        PictureAPI.sharePicture(pid).then((r) => {
                            copy(SERVER_URL + "/picture/share/" + r.sid);
                            Message.success("已经复制到剪贴板");
                        });
                    }
                    if (link) {
                        copy(link);
                    }
                    setIsChecked(true);
                    if (timeout != null) {
                        clearTimeout(timeout);
                        timeout = null;
                    }
                    timeout = setTimeout(() => {
                        setIsChecked(false);
                        timeout = null;
                    }, 1000);
                }}>
            {isChecked ? <CheckLinearIcon className={props.className}/> : <FiCopy className={props.className}/>}
        </Button>
    )
}

export default function Picture(props: PictureProps) {
    const descriptionOpen = useDisclosure();
    let [name, setName] = useState(props.name);
    let [link, setShareLink] = useState("");
    let [saveLoading, setSaveLoading] = useState(false);
    const [delLoading, setDelLoading] = useState(false);
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set(['none']));

    const [textColor, setTextColor] = useState('text-black');
    let originName = props.name;

    function generateShareLink(shareMode?: number, password?: string) {
        PictureAPI.sharePicture(props.pid, shareMode, password).then((r) => {
            setShareLink(SERVER_URL + "/picture/share/" + r.sid);
            Message.success("成功分享'" + props.name + "'");
        });
    }

    const deletePicture = (onClose: () => void) => {
        setDelLoading(true);
        IOC.picture.deletePicture(props.pid)
            .then(() => {
                Message.success('删除成功')
                props.onDelete?.(props.pid);
            })
            .catch((reason) => {
                Message.error(reason)
            })
            .finally(() => {
                onClose();
                setDelLoading(false)
            })
    }

    const footerRef = useRef(null);

    useEffect(() => {
        getImgContrast({
            imgSrc: props.url,
        })
            .then((textState) => {
                setTextColor(textState === 'white' ? 'text-white' : 'text-black')
            })
    }, [props.url, setTextColor])


    return (
        <>
            <Card
                isFooterBlurred
                radius="lg"
                className="border-none items-center relative"
                isPressable
                onPress={descriptionOpen.onOpen}
                style={{maxWidth: 450, width: '100%'}}
            >
                <Image
                    alt={props.name}
                    className="object-cover"
                    width={450}
                    height={200}
                    src={props.url}
                    isZoomed
                />
                <CardFooter
                    className={
                        `
                        w-auto max-w-[75%] justify-between
                        before:bg-white/10 before:rounded-xl
                        border-white/20 overflow-hidden py-2 absolute rounded-large bottom-1 shadow-small ml-1 z-10 space-x-2
                        ${textColor}
                        `
                    }
                >
                    <p className={`text-tiny font-mono truncate ${textColor}`} title={name}>{name}</p>&nbsp;
                    <SharedButton link={link} pid={props.pid} className={
                        `${textColor}`
                    }/>
                    <Popover>
                        <PopoverTrigger>
                            <Button isIconOnly className="justify-center" variant="bordered" size="sm"
                                    isLoading={delLoading}>
                                {!delLoading && <DeleteIcon className={`${textColor}`}/>}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                            {(titleStyle) => (
                                <div className="px-2 py-1">
                                    <h3 className="text-lg" {...titleStyle}>确定要删除吗</h3>
                                    <div className="my-2">
                                        <Button color="danger" size="sm" fullWidth
                                                onClick={() => deletePicture(() => {
                                                })}>确认</Button>
                                    </div>
                                </div>
                            )}
                        </PopoverContent>
                    </Popover>
                </CardFooter>
            </Card>

            <Modal isOpen={descriptionOpen.isOpen} onOpenChange={descriptionOpen.onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">图片详情</ModalHeader>
                            <ModalBody>
                                <div className="w-fit mx-auto">
                                    <Image
                                        alt={props.name}
                                        className="object-cover mx-auto"
                                        width={200}
                                        height={200}
                                        src={props.url}
                                    />
                                </div>
                                <p>
                                    <Input placeholder={"图片名称"} value={name} onValueChange={setName}/>
                                </p>
                                <p className="flex items-center justify-center">
                                    {link == "" ?
                                        <ButtonGroup>
                                            <Button variant={"flat"} color={"secondary"} onClick={() =>{generateShareLink(1)}}>分享水印图片</Button>
                                            <Button
                                                variant={props.group?.disabled.includes("compressed") ? "solid" : "flat"}
                                                color={props.group?.disabled.includes("compressed") ? "default" : "secondary"}
                                                disabled={props.group?.disabled.includes("compressed")}
                                                onClick={() =>{generateShareLink(2)}}>分享压缩图片</Button>
                                            <Button
                                                variant={props.group?.disabled.includes("original") ? "solid" : "flat"}
                                                color={props.group?.disabled.includes("original") ? "default" : "secondary"}
                                                disabled={props.group?.disabled.includes("original")}
                                                onClick={() =>{generateShareLink(3)}}>分享原图</Button>
                                        </ButtonGroup>
                                        : <div className="flex space-x-3" style={{width: 450}}>
                                            <Input className={"font-mono"} variant={"underlined"} value={link}
                                                   endContent={
                                                       <SharedButton link={link}/>
                                                   }></Input>
                                        </div>}
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button isLoading={saveLoading} color="primary" onPress={() => {
                                    setSaveLoading(true);
                                    PictureAPI.changePictureName(name, props.pid).then(() => {
                                        Message.success("已保存");
                                        originName = name;
                                        setSaveLoading(false);
                                        onClose();
                                    });
                                }}>
                                    保存
                                </Button>
                                <Button disabled={saveLoading} color="danger" variant={"light"} onPress={() => {
                                    setName(originName);
                                    onClose();
                                }}>
                                    取消
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export type PictureProps = {
    url: string,
    pid: string,
    name: string,
    pubicMode?: string,
    group?: PriceInfo,
    onPress?: () => void,
    onDelete?: (pid: string) => void,
}
