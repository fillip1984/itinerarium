"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { FaListCheck } from "react-icons/fa6";

import type { ReservationType } from "~/server/api/types";
import { Button } from "~/components/ui/button";
import { useTRPC } from "~/trpc/react";
import ColorPickerDropdown from "../color-selector";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function ReservationDetails({
  reservationToManage,
  setReservationToManage,
}: {
  reservationToManage: ReservationType;
  setReservationToManage: (reservation: ReservationType | null) => void;
}) {
  const [name, setName] = useState(reservationToManage.name);
  const [description, setDescription] = useState(
    reservationToManage.description ?? "Enter a description...",
  );
  const [color, setColor] = useState(reservationToManage.color);

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

  const queryClient = useQueryClient();
  const trpc = useTRPC();
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
    updateReservation.mutate({
      id: reservationToManage.id,
      name,
      description: description === "Enter a description..." ? "" : description,
      color,
    });
  };
  useEffect(() => {
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
  }, [isEditingName, isEditingDescription, color, reservationToManage.color]);

  return (
    <div className="h-80 overflow-y-auto gap-2 flex flex-col pr-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button
            variant={"outline"}
            onClick={() => setReservationToManage(null)}
          >
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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <FaListCheck />
          <h4>Lists</h4>
        </div>
        <Badge>{reservationToManage.lists.length}</Badge>
      </div>
    </div>
  );
}
