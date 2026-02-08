"use client";
import { Boarder } from "@/types";
import getBackendUrl from "@/utils/getBackendUrl";
import {
    createContext,
    useContext,
    ReactNode,
    useState,
    useEffect,
} from "react";

type BoardersContextType = {
    boarders: Boarder[];
    refreshBoarders: () => void;
    addBoarder: (boarder: Boarder) => void;
    removeBoarder: (id: string) => void;
};

export const BoardersContext = createContext<BoardersContextType | undefined>(
    undefined,
);

export const useBoardersContext = (): BoardersContextType => {
    const context = useContext(BoardersContext);
    if (!context) {
        throw new Error("Boarders Context being used outside of provider");
    }
    return context;
};

export const BoardersProvider = ({ children }: { children: ReactNode }) => {
    const [boarders, setBoarders] = useState<Boarder[]>([]);
    const [trigger, setTrigger] = useState(0);

    const refreshBoarders = () => setTrigger((prev) => prev + 1);
    const addBoarder = (boarder: Boarder) =>
        setBoarders((prev) => [...prev, boarder]);
    const removeBoarder = (id: string) =>
        setBoarders((prev) => prev.filter((b) => b.id !== id));

    useEffect(() => {
        const fetchBoarders = async () => {
            try {
                const res = await fetch(`${getBackendUrl()}/api/boarders`, {
                    method: "GET",
                });
                const data = await res.json();
                if (!res.ok) {
                    const errMsg = data.msg;
                    console.error(errMsg);
                }
                setBoarders(data.boarders);
            } catch (error) {
                console.error(error);
            }
        };
        fetchBoarders();
    }, [trigger]);

    return (
        <BoardersContext.Provider
            value={{ boarders, refreshBoarders, addBoarder, removeBoarder }}
        >
            {children}
        </BoardersContext.Provider>
    );
};
