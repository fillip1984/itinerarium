"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { BsPalette } from "react-icons/bs";

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
import ReservationDetails from "./reservation-details";
import ReservationList from "./reservation-list";

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

  // ux: reset to list view when opening dialog
  useEffect(() => {
    if (showManageDialog) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReservationToManage(null);
    }
  }, [showManageDialog]);

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
              <li>Reservations reserve timeslots during a day.</li>
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
