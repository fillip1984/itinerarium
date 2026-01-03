"use client";

import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsPalette } from "react-icons/bs";

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
import { Field, FieldGroup, FieldLabel } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { freeReservation } from "~/server/api/types";
import { useReservationStore } from "~/server/stores/reservationStore";
import { useTRPC } from "~/trpc/react";

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

  const [showNewDialog, setShowNewDialog] = useState(false);

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
            <DropdownMenuItem onSelect={() => setShowNewDialog(true)}>
              Manage Activities
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <DialogContent className="sm:max-w-106.25">
          <DialogHeader>
            <DialogTitle>Create New File</DialogTitle>
            <DialogDescription>
              Provide a name for your new file. Click create when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="existing">
            <TabsList>
              <TabsTrigger value="existing">Existing</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
            </TabsList>
            <TabsContent value="existing">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="new">
              <FieldGroup className="py-3">
                <Field>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="shadcn@vercel.com"
                    autoComplete="off"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="message">Message (Optional)</FieldLabel>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Check out this file"
                  />
                </Field>
              </FieldGroup>
            </TabsContent>
          </Tabs>
          {/* <FieldGroup className="pb-3">
            <Field>
              <FieldLabel htmlFor="filename">File Name</FieldLabel>
              <Input id="filename" name="filename" placeholder="document.txt" />
            </Field>
          </FieldGroup>
          <FieldGroup className="py-3">
            <Field>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="shadcn@vercel.com"
                autoComplete="off"
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="message">Message (Optional)</FieldLabel>
              <Textarea
                id="message"
                name="message"
                placeholder="Check out this file"
              />
            </Field>
          </FieldGroup> */}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
