"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { BsPalette } from "react-icons/bs";
import { FaListCheck } from "react-icons/fa6";
import { MdTimelapse } from "react-icons/md";

import type { ReservationType } from "~/server/api/types";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { freeReservation } from "~/server/api/types";
import { useReservationStore } from "~/server/stores/reservationStore";
import { useTRPC } from "~/trpc/react";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

export default function ReservationSelector() {
  const queryClient = useQueryClient();
  const trpc = useTRPC();
  const { data: reservations, isLoading } = useQuery(
    trpc.reservation.getAll.queryOptions(),
  );

  // init db
  const initReservations = useMutation(
    trpc.reservation.initialize.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          void queryClient.invalidateQueries(trpc.reservation.pathFilter()),
        );
      },
    }),
  );
  useEffect(() => {
    if (!isLoading && reservations?.length === 0) {
      initReservations.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // state for selected reservation
  const { selectedReservationId, setSelectedReservationId } =
    useReservationStore();

  const [showManageDialog, setShowManageDialog] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <BsPalette className="" />
            <span className="sr-only">Select Reservation</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Reservation Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedReservationId}
            onValueChange={(value) => {
              const res =
                reservations?.find((reservation) => reservation.id === value)
                  ?.id ?? "";
              setSelectedReservationId(res);
            }}
          >
            <DropdownMenuRadioItem
              value=""
              onClick={() => setSelectedReservationId(freeReservation.id)}
            >
              Free
            </DropdownMenuRadioItem>
            <DropdownMenuSeparator />
            {reservations?.map((reservation) => (
              <DropdownMenuRadioItem
                key={reservation.id}
                value={reservation.id}
              >
                {reservation.name}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onSelect={() => setShowManageDialog(true)}>
              Manage Reservations
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ManageReservationsDialog
        showManageDialog={showManageDialog}
        setShowManageDialog={setShowManageDialog}
      />
    </>
  );
}

const ManageReservationsDialog = ({
  showManageDialog,
  setShowManageDialog,
}: {
  showManageDialog: boolean;
  setShowManageDialog: (open: boolean) => void;
}) => {
  const trpc = useTRPC();
  const { data: reservations } = useQuery(
    trpc.reservation.getAll.queryOptions(),
  );
  const [reservationToManage, setReservationToManage] =
    useState<ReservationType | null>(null);

  return (
    <Dialog open={showManageDialog} onOpenChange={setShowManageDialog}>
      <DialogContent
        className="sm:max-w-106.25 h-130"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Manage Reservations</DialogTitle>
          <DialogDescription>
            <ul className="list-disc ml-6 ">
              <li>Reservations reserve timeslots during a day. </li>
              <li>
                Lists suggest activities to perform during those reservations.
              </li>
            </ul>
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-hidden">
          <AnimatePresence mode="sync" initial={false}>
            {reservationToManage === null ? (
              <motion.div
                key="list"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ReservationList
                  reservations={reservations ?? []}
                  setReservationToManage={setReservationToManage}
                />
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ReservationDetails
                  reservationToManage={reservationToManage}
                  setReservationToManage={setReservationToManage}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const calcFreeHoursPerWeek = (reservations: ReservationType[]) => {
  const totalHours = 24 * 7;
  const reservedHours = reservations.reduce(
    (acc, reservation) => acc + reservation.timeslots.length,
    0,
  );
  return totalHours - reservedHours;
};

const ReservationList = ({
  reservations,
  setReservationToManage,
}: {
  reservations: ReservationType[];
  setReservationToManage: (reservation: ReservationType | null) => void;
}) => {
  return (
    <div className="h-80 overflow-y-auto gap-2 flex flex-col pr-2">
      {reservations?.map((reservation) => (
        <ReservationCard
          key={reservation.id}
          reservation={reservation}
          setReservationToManage={setReservationToManage}
        />
      ))}
      <ReservationCard
        reservation={{
          ...freeReservation,
          timeslots: Array.from({
            length: calcFreeHoursPerWeek(reservations ?? []),
          }).map((_, i) => {
            return { startTime: i.toString() };
          }),
        }}
      />
    </div>
  );
};

const ReservationCard = ({
  reservation,
  setReservationToManage,
}: {
  reservation: ReservationType;
  setReservationToManage?: (reservation: ReservationType | null) => void;
}) => {
  return (
    <div
      onClick={() =>
        setReservationToManage && setReservationToManage(reservation)
      }
      className="p-2 border rounded hover:border-white"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{reservation.name}</h3>
        <p className="text-sm text-muted-foreground">
          <div
            style={{ backgroundColor: reservation.color }}
            className="h-4 w-4 rounded"
          ></div>
        </p>
      </div>

      <div className="flex flex-col pl-1 gap-1">
        <div className="flex gap-1 items-center">
          <FaListCheck />
          <span className="font-bold">{reservation.lists?.length ?? 0}</span>
        </div>
        <div className="flex gap-1 items-center">
          <MdTimelapse />
          <span className="font-bold">
            {reservation.timeslots?.length ?? 0}
          </span>
          <span className="text-muted-foreground">hours/week</span>
        </div>
      </div>
    </div>
  );
};

const ReservationDetails = ({
  reservationToManage,
  setReservationToManage,
}: {
  reservationToManage: ReservationType;
  setReservationToManage: (reservation: ReservationType | null) => void;
}) => {
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
};

const ColorPickerDropdown = ({
  currentColor,
  updateColor,
}: {
  currentColor: string;
  updateColor: (color: string) => void;
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          style={{ backgroundColor: currentColor }}
        >
          <span className="sr-only">Select Color</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Color</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="grid grid-cols-5 gap-2 p-2">
          {[
            "#f87171",
            "#fbbf24",
            "#34d399",
            "#60a5fa",
            "#a78bfa",
            "#f472b6",
            "#f97316",
            "#eab308",
            "#10b981",
            "#3b82f6",
            "#8b5cf6",
            "#ec4899",
          ].map((color) => (
            <DropdownMenuItem
              key={color}
              onClick={() => updateColor(color)}
              className="h-8 w-8 rounded"
              style={{ backgroundColor: color }}
            ></DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
