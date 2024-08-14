import "./styles/ChatSend.css";
import { useState, useEffect, FormEventHandler } from "react";
import { MouseEventHandler, ChangeEventHandler } from "react";
import { logger } from "./logger";
import { Message } from "./Chat";

interface ChatSendProps {
  socket: WebSocket | null;
  newMessages: Array<Message>;
}

interface Message2BeSent {
  message: string;
}

function sendFile(socket: WebSocket, file: File) {
  const reader = new FileReader();

  reader.onload = function (e) {
    const target = e.target as FileReader;
    const rawData = target.result as ArrayBuffer;
    const byteArray = new Uint8Array(rawData);

    socket.send(byteArray.buffer);
  };

  reader.readAsArrayBuffer(file);
}

async function sendImage(
  socket: WebSocket,
  image: File,
  messageCountBeforeSending: number,
  newMessages: Array<Message>
) {
  sendFile(socket, image);
  setTimeout(() => {
    if (messageCountBeforeSending < newMessages.length) {
      logger.log(`Image arrived: ${image.name}`);
    } else {
      logger.log(`Resending: ${image.name}`);
      sendFile(socket, image);
    }
  }, 500);
}

export default function ChatSend({ socket, newMessages }: ChatSendProps) {
  const [inputMessage, setInputMessage] = useState<string>("");
  const [sendBtnStateClassName, setSendBtnStateClassName] =
    useState<string>("send-main-active");
  const [sendError, setSendError] = useState<string | null>(null);
  const [images, setImages] = useState<Array<File>>([]);
  const [imageInputValue, setImageInputValue] = useState<string | undefined>(
    undefined
  );
  const [image2bSent, setImage2bSent] = useState<File | null>(null);

  useEffect(() => {
    setSendBtnStateClassName(
      inputMessage === "" ? "send-main-inactive" : "send-main-active"
    );
  }, [inputMessage]);

  useEffect(() => {
    if (image2bSent != null) {
      let messageCountBeforeSending = newMessages.length;
      if (socket)
        sendImage(socket, image2bSent, messageCountBeforeSending, newMessages);
    }
  }, [image2bSent]);

  useEffect(() => {
    if (newMessages.at(-1)?.contains_image) {
      // this is added to ensure that the trigger for sending another image is activated when the previous message also contained an image
      if (images.length == 0) {
        setImage2bSent(null);
      } else if (images.length >= 1) {
        const newImages = [...images];
        const newImage2bSent = newImages.pop();
        setImages(newImages);
        if (newImage2bSent) setImage2bSent(newImage2bSent);
      }
    }
  }, [newMessages]);

  const sendBtnClickHandler: MouseEventHandler = (e) => {
    if (inputMessage === "" && images.length === 0) return;
    let i = 0;
    if (socket) {
      while (i < 10) {
        if (socket.readyState == WebSocket.OPEN) {
          if (inputMessage !== "") {
            const message = { message: inputMessage } as Message2BeSent;
            const messageCountBeforeSending = newMessages.length;
            socket.send(JSON.stringify(message));
            logger.log(`Message sent: ${inputMessage}`);
            if (sendError) setSendError(null);
            setInputMessage("");
            setTimeout(() => {
              if (messageCountBeforeSending < newMessages.length) {
                logger.log(`Message arrived: ${inputMessage}`);
              } else {
                logger.log(`Resending: ${inputMessage}`);
                socket.send(JSON.stringify(message));
                if (sendError) setSendError(null);
                setInputMessage("");
              }
            }, 500);
          }

          const newImages = [...images];
          const newImage2bSent = newImages.pop();
          setImages(newImages);
          if (newImage2bSent) setImage2bSent(newImage2bSent);

          return;
        }
        i++;
      }
      setSendError("Unable to send message, try again later.");
    }
  };

  const textareaChangleHandler: ChangeEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    setInputMessage(target.value);
    setSendBtnStateClassName(
      inputMessage === "" ? "send-main-inactive" : "send-main-active"
    );
  };

  const imageInputHandler: FormEventHandler = (e) => {
    const target = e.target as HTMLInputElement;
    setImageInputValue(target.value);
    setImages((oldImages) =>
      target.files ? [...oldImages, ...Array.from(target.files)] : oldImages
    );
    setSendBtnStateClassName("send-main-active");
  };

  function deleteImageClickHandlerGenerator(ind: number): MouseEventHandler {
    const deleteImageClickHandler: MouseEventHandler = (e) => {
      const oldImages = [...images];
      oldImages.splice(ind, 1);
      setImages(oldImages);
      setImageInputValue(""); // this is done to ensure that the user can delete and then upload the same picture again
      setSendBtnStateClassName(
        oldImages.length === 0 ? "send-main-inactive" : "send-main-active"
      );
    };

    return deleteImageClickHandler;
  }

  return (
    <div className="send">
      {sendError ? <div className="send-error">{sendError}</div> : <></>}
      <div className="send-main">
        <div className="send-main-text">
          <textarea
            value={inputMessage}
            onChange={textareaChangleHandler}
          ></textarea>
        </div>
        <div
          className={`send-main-send ${sendBtnStateClassName}`}
          onClick={sendBtnClickHandler}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            className="bi bi-send"
            viewBox="0 0 16 16"
          >
            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
          </svg>
        </div>
      </div>
      <div className="send-images">
        <div className="send-images-main">
          <input
            type="file"
            id="input-images"
            onChange={imageInputHandler}
            value={imageInputValue}
            multiple
            accept="image/png, image/jpeg"
          />

          <div className="send-images-main-input">
            <label htmlFor="input-images">
              <div className="send-images-main-input-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="bi bi-plus-lg"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"
                  />
                </svg>
              </div>
            </label>
          </div>
          {images.length > 0 ? (
            images.map((image, ind) => (
              <div
                key={`send-images-main-image-${ind}`}
                className="send-images-main-image"
              >
                <img src={URL.createObjectURL(image)} />
                <div
                  className="send-images-main-image-delete"
                  onClick={deleteImageClickHandlerGenerator(ind)}
                >
                  <div className="send-images-main-image-delete-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      className="bi bi-x-lg"
                      viewBox="0 0 16 16"
                    >
                      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
