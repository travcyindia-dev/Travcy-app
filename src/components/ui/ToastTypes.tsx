"use client"

import { toast } from "sonner"
import { Button } from "./Shared"


export function SonnerTypes() {
    return (
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => toast("Event has been created")}>
                Default
            </Button>
            <Button
                variant="outline"
                onClick={() => toast.success("Event has been created")}
            >
                Success
            </Button>
            <Button
                variant="outline"
                onClick={() =>
                    toast.info("Be at the area 10 minutes before the event time")
                }
            >
                Info
            </Button>
            <Button
                variant="outline"
                onClick={() =>
                    toast.warning("Event start time cannot be earlier than 8am")
                }
            >
                Warning
            </Button>
            <Button
                variant="outline"
                onClick={() => toast.error("Event has not been created")}
            >
                Error
            </Button>
            <Button
                variant="outline"
                onClick={() => {
                    toast.promise<{ name: string }>(
                        () =>
                            new Promise((resolve) =>
                                setTimeout(() => resolve({ name: "Event" }), 2000)
                            ),
                        {
                            loading: "Loading...",
                            success: (data) => `${data.name} has been created`,
                            error: "Error",
                        }
                    )
                }}
            >
                Promise
            </Button>
        </div>
    )
}

export const toastSuccess = (msg: string) =>
    toast.success(msg, { className: "toast-success" })

export const toastError = (msg: string) =>
    toast.error(msg, { className: "toast-error" })

export const toastWarning = (msg: string) =>
    toast.warning(msg, { className: "toast-warning" })

export const toastInfo = (msg: string) =>
    toast.info(msg, { className: "toast-info" })

export const toastDefault = (msg: string) =>
    toast(msg, { className: "toast-default" })