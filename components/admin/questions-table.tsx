"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { PencilSimpleIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QuestionDialog } from "@/components/admin/question-dialog";
import { db } from "@/lib/db";
import type { QuestionRow } from "@/lib/questions";

export function QuestionsTable() {
  const t = useTranslations("admin.questions");
  const auth = db.useAuth();
  const { isLoading, data, error } = db.useQuery({
    questions: {},
  });
  const [pendingDelete, setPendingDelete] = useState<QuestionRow | null>(null);

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }
  if (error) {
    return (
      <Card>
        <CardContent className="p-6 text-sm">{error.message}</CardContent>
      </Card>
    );
  }

  const questions = (data?.questions ?? []) as QuestionRow[];

  const handleAdd = async (values: {
    specialty: string;
    stem: string;
    choices: string[];
    correctIndex: number;
    explanation: string;
    tags: string[];
    isPublished: boolean;
  }) => {
    if (!auth.user) return;
    try {
      const id = crypto.randomUUID();
      await db.transact(
        db.tx.questions[id]
          .update({
            ...values,
            createdAt: new Date().toISOString(),
          })
          .link({ createdBy: auth.user.id })
      );
      toast.success(t("saveSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("errors.required"));
    }
  };

  const handleEdit =
    (q: QuestionRow) =>
    async (values: {
      specialty: string;
      stem: string;
      choices: string[];
      correctIndex: number;
      explanation: string;
      tags: string[];
      isPublished: boolean;
    }) => {
      try {
        await db.transact(db.tx.questions[q.id].update(values));
        toast.success(t("saveSuccess"));
      } catch (err) {
        toast.error(err instanceof Error ? err.message : t("errors.required"));
      }
    };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await db.transact(db.tx.questions[pendingDelete.id].delete());
      toast.success(t("deleteSuccess"));
      setPendingDelete(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("errors.required"));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("title")}</h1>
        <QuestionDialog
          trigger={
            <Button>
              <PlusIcon className="me-2 size-4" />
              {t("add")}
            </Button>
          }
          onSubmit={handleAdd}
        />
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            {t("empty")}
          </CardContent>
        </Card>
      ) : (
        <div dir="ltr" className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("columns.stem")}</TableHead>
                <TableHead className="w-36">{t("columns.specialty")}</TableHead>
                <TableHead className="w-48">{t("columns.tags")}</TableHead>
                <TableHead className="w-24">{t("columns.published")}</TableHead>
                <TableHead className="w-32 text-end">
                  {t("columns.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell className="max-w-md truncate">{q.stem}</TableCell>
                  <TableCell className="w-36 text-sm">{q.specialty ?? "—"}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {q.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {q.isPublished ? (
                      <Badge>{t("fields.isPublished")}</Badge>
                    ) : (
                      <Badge variant="secondary">—</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex justify-end gap-1">
                      <QuestionDialog
                        trigger={
                          <Button variant="ghost" size="icon">
                            <PencilSimpleIcon />
                            <span className="sr-only">{t("edit")}</span>
                          </Button>
                        }
                        initial={q}
                        onSubmit={handleEdit(q)}
                      />
                      <AlertDialog
                        open={pendingDelete?.id === q.id}
                        onOpenChange={(open) =>
                          setPendingDelete(open ? q : null)
                        }
                      >
                        <AlertDialogTrigger
                          render={<Button variant="ghost" size="icon" />}
                        >
                          <TrashIcon className="text-destructive" />
                          <span className="sr-only">{t("delete")}</span>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {t("deleteConfirmTitle")}
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {t("deleteConfirmBody")}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>
                              {t("confirmDelete")}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
