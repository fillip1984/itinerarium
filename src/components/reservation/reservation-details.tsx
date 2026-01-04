"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Trash } from "lucide-react";
import { FaListCheck } from "react-icons/fa6";

import type {
  ListItemType,
  ListType,
  ReservationDetailType,
} from "~/server/api/types";
import { Button } from "~/components/ui/button";
import { useTRPC } from "~/trpc/react";
import ColorPickerDropdown from "../color-selector";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "../ui/input-group";
import { Textarea } from "../ui/textarea";

export default function ReservationDetails({
  reservationId,
  dismiss,
}: {
  reservationId: string;
  dismiss: () => void;
}) {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  // fetch data
  const { data: reservation } = useQuery(
    trpc.reservation.getById.queryOptions(
      { id: reservationId },
      { enabled: !!reservationId },
    ),
  );

  // form state
  const [reservationToManage, setReservationToManage] =
    useState<ReservationDetailType | null>(null);
  useEffect(() => {
    if (reservation) {
      setReservationToManage(reservation);
    }
  }, [reservation]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("Enter a description...");
  const [color, setColor] = useState("#ffffff");

  const [isEditingName, setIsEditingName] = useState(false);
  const nameFieldRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isEditingName && nameFieldRef.current) {
      nameFieldRef.current.focus();
    }
  }, [isEditingName]);

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const descriptionFieldRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (isEditingDescription && descriptionFieldRef.current) {
      if (description === "Enter a description...") {
        setDescription("");
      }
      descriptionFieldRef.current.focus();
      descriptionFieldRef.current.setSelectionRange(
        descriptionFieldRef.current.value.length,
        descriptionFieldRef.current.value.length,
      );
    } else {
      if (description.trim() === "") {
        setDescription("Enter a description...");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditingDescription]);

  // mutations

  const updateReservation = useMutation(
    trpc.reservation.update.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          void queryClient.invalidateQueries(trpc.reservation.pathFilter()),
        );
      },
    }),
  );
  const handleUpdatesToReservationDetails = () => {
    if (!reservationToManage) return;

    updateReservation.mutate({
      id: reservationToManage.id,
      name,
      description: description === "Enter a description..." ? "" : description,
      color,
    });
  };
  useEffect(() => {
    if (!reservationToManage) return;
    if (
      !isEditingName &&
      !isEditingDescription &&
      (name !== reservationToManage.name ||
        (description !== "Enter a description..." &&
          description !== reservationToManage.description))
    ) {
      console.log(
        "Updating reservation details due to name or description...",
        { name, description },
      );
      handleUpdatesToReservationDetails();
    } else if (color && color !== reservationToManage.color) {
      console.log("Updating reservation details due to color...");
      handleUpdatesToReservationDetails();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditingName, isEditingDescription, color, reservationToManage?.color]);

  if (!reservationToManage) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-80 overflow-y-auto gap-2 flex flex-col pr-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant={"outline"} onClick={dismiss}>
            <ArrowLeft />
          </Button>
          {isEditingName ? (
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setIsEditingName(false)}
              ref={nameFieldRef}
            />
          ) : (
            <h3
              className="hover:bg-white/10 rounded transition-colors"
              onClick={() => setIsEditingName(true)}
            >
              {name}
            </h3>
          )}
        </div>
        <ColorPickerDropdown
          currentColor={color}
          updateColor={(newColor) => setColor(newColor)}
        />
      </div>
      {isEditingDescription ? (
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setIsEditingDescription(false)}
          ref={descriptionFieldRef}
        />
      ) : (
        <p
          onClick={() => setIsEditingDescription(true)}
          className="text-muted-foreground border rounded p-2 hover:border-white hover:bg-white/10 transition-colors"
        >
          {description}
        </p>
      )}

      <ListSection reservation={reservationToManage} />
    </div>
  );
}

const ListSection = ({
  reservation,
}: {
  reservation: ReservationDetailType;
}) => {
  const [newListName, setNewListName] = useState("");

  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: lists } = useQuery(trpc.list.getAll.queryOptions());

  const { mutateAsync: createList } = useMutation(
    trpc.list.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          void queryClient.invalidateQueries(trpc.reservation.pathFilter()),
        );
        setNewListName("");
      },
    }),
  );
  const handleAddNewList = async () => {
    await createList({ name: newListName, reservationId: reservation.id });
  };

  const [selectedList, setSelectedList] = useState<ListType | null>(null);

  return (
    <div className="flex flex-col gap-2">
      {/* show all existing lists or selected list */}
      {selectedList ? (
        <ListDetails
          list={selectedList}
          dismiss={() => setSelectedList(null)}
        />
      ) : (
        <>
          {/* heading */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <FaListCheck />
              <h4>Lists</h4>
            </div>
            <Badge>{reservation.lists.length}</Badge>
          </div>
          {lists?.map((list) => (
            <div
              key={list.id}
              onClick={() => setSelectedList(list)}
              className="p-2 border rounded hover:border-white hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center"
            >
              {list.name} <ArrowRight />
            </div>
          ))}
          {/* add list */}
          <InputGroup>
            <InputGroupInput
              placeholder="New list..."
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
            />
            <InputGroupAddon align={"inline-end"}>
              <InputGroupButton
                onClick={handleAddNewList}
                disabled={!newListName.trim()}
              >
                Add
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </>
      )}
    </div>
  );
};

const ListDetails = ({
  list,
  dismiss,
}: {
  list: ListType;
  dismiss: () => void;
}) => {
  const [newItem, setNewItem] = useState("");

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  // add item
  const { mutateAsync: createItem } = useMutation(
    trpc.list.addItem.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          void queryClient.invalidateQueries(trpc.reservation.pathFilter()),
        );
        setNewItem("");
      },
    }),
  );
  const handleAddNewItem = async () => {
    await createItem({ listId: list.id, itemName: newItem });
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Button onClick={dismiss}>
          <ArrowLeft />
        </Button>
        <h4>{list.name}</h4>
      </div>

      {/* display items */}
      {list.items.map((item) => (
        <ListItemRow key={item.id} item={item} />
      ))}

      {/* add item */}
      <InputGroup>
        <InputGroupInput
          placeholder="New item..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <InputGroupAddon align={"inline-end"}>
          <InputGroupButton
            onClick={handleAddNewItem}
            disabled={!newItem.trim()}
          >
            Add
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </>
  );
};

const ListItemRow = ({ item }: { item: ListItemType }) => {
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  // complete item
  const { mutateAsync: completeItem } = useMutation(
    trpc.list.completeItem.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          void queryClient.invalidateQueries(trpc.reservation.pathFilter()),
        );
      },
    }),
  );
  const toggleItemCompletion = async () => {
    await completeItem({ itemId: item.id, complete: !item.complete });
  };

  // remove item
  const { mutateAsync: removeItem } = useMutation(
    trpc.list.removeItem.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          void queryClient.invalidateQueries(trpc.reservation.pathFilter()),
        );
      },
    }),
  );
  const handleRemoveItem = async () => {
    await removeItem({ itemId: item.id });
  };
  return (
    <div className="flex gap-2 items-center p-2 hover:bg-white/10 transition-colors">
      <input
        type="checkbox"
        checked={item.complete}
        onChange={toggleItemCompletion}
      />
      <span
        className={item.complete ? "line-through text-muted-foreground" : ""}
      >
        {item.name}
      </span>
      <Button
        variant={"destructive"}
        onClick={handleRemoveItem}
        className="ml-auto"
      >
        <Trash />
      </Button>
    </div>
  );
};
