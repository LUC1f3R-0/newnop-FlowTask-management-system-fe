import { useEffect, useRef, useState } from "react";
import { AxiosError } from "axios";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosApiInstance } from "@/lib/apiInstance";

export type AssignableUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

type AssignableUsersResponse = {
  data?: {
    users?: AssignableUser[];
  };
  users?: AssignableUser[];
};

type UserEmailComboboxProps = {
  value: string;
  initialUser?: AssignableUser | null;
  disabled?: boolean;
  onChange: (user: AssignableUser | null) => void;
};

function getUsersFromResponse(responseData: AssignableUsersResponse) {
  return responseData.data?.users ?? responseData.users ?? [];
}

export function UserEmailCombobox({
  value,
  initialUser,
  disabled = false,
  onChange,
}: UserEmailComboboxProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [search, setSearch] = useState(initialUser?.email ?? "");
  const [users, setUsers] = useState<AssignableUser[]>([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearch(initialUser?.email ?? "");
  }, [initialUser?.id, initialUser?.email]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);

        const response =
          await axiosApiInstance.get<AssignableUsersResponse>(
            "/users/assignable",
            {
              params: {
                search: search.trim() || undefined,
              },
            },
          );

        setUsers(getUsersFromResponse(response.data));
      } catch (error) {
        const axiosError = error as AxiosError<any>;

        console.error("Fetch assignable users failed:", {
          status: axiosError.response?.status,
          data: axiosError.response?.data,
        });

        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search, open]);

  const clearSelectedUser = () => {
    setSearch("");
    setUsers([]);
    onChange(null);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          disabled={disabled}
          placeholder="Search user by email or name"
          className="pl-9 pr-10"
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setSearch(event.target.value);
            setOpen(true);

            if (value) {
              onChange(null);
            }
          }}
        />

        {search && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            disabled={disabled}
            className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
            onClick={clearSelectedUser}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {open && !disabled && (
        <div className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-popover shadow-md">
          {isLoading ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              Searching users...
            </div>
          ) : users.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              No users found.
            </div>
          ) : (
            users.map((user) => (
              <button
                key={user.id}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-accent"
                onMouseDown={(event) => {
                  event.preventDefault();

                  setSearch(user.email);
                  setOpen(false);
                  onChange(user);
                }}
              >
                <div className="text-sm font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}