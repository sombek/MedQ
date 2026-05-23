"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/db";

type UserRow = {
  id: string;
  email: string;
  profile?: {
    id: string;
    displayName?: string;
    isAdmin: boolean;
    isActive: boolean;
    createdAt: string;
  };
};

export function UsersTable() {
  const t = useTranslations("admin.users");
  const { isLoading, data, error } = db.useQuery({
    $users: {
      profile: {},
    },
  } as any);

  if (isLoading) return <Skeleton className="h-64 w-full" />;
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm">{error.message}</CardContent>
      </Card>
    );
  }

  const users = ((data as any)?.$users ?? []) as UserRow[];

  const handleToggleActive = async (profileId: string, next: boolean) => {
    try {
      await db.transact(db.tx.profiles[profileId].update({ isActive: next }));
      toast.success(t("toggleSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : String(err));
    }
  };

  if (!users.length) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-sm text-muted-foreground">
          {t("empty")}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">{t("title")}</h1>
      <div dir="ltr" className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.email")}</TableHead>
              <TableHead>{t("columns.displayName")}</TableHead>
              <TableHead className="w-24">{t("columns.isAdmin")}</TableHead>
              <TableHead className="w-24">{t("columns.isActive")}</TableHead>
              <TableHead className="w-40">{t("columns.createdAt")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.profile?.displayName ?? "—"}</TableCell>
                <TableCell>
                  {u.profile?.isAdmin ? <Badge>{t("adminBadge")}</Badge> : "—"}
                </TableCell>
                <TableCell>
                  {u.profile ? (
                    <Switch
                      checked={u.profile.isActive}
                      onCheckedChange={(v) =>
                        handleToggleActive(u.profile!.id, v)
                      }
                    />
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell>
                  {u.profile?.createdAt
                    ? new Date(u.profile.createdAt).toLocaleDateString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
