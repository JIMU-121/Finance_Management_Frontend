import { useState } from "react";
import { useForm } from "react-hook-form";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Button from "../components/ui/button/Button";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table/index";
import Badge from "../components/ui/badge/Badge";

interface DocumentType {
  id: number;
  name: string;
  code: string;
  status: "Active" | "Inactive";
}

type FormValues = {
  name: string;
  code: string;
};

export default function ManageDocumentType() {
  const [view, setView] = useState<"table" | "form">("table");
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([
    { id: 1, name: "Invoice", code: "INV", status: "Active" },
    { id: 2, name: "Purchase Order", code: "PO", status: "Active" },
    { id: 3, name: "Receipt", code: "REC", status: "Inactive" },
  ]);

  const [editId, setEditId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
  });

  const codeValue = watch("code");
  const nameValue = watch("name");
  const onSubmit = (data: FormValues) => {
    const upperCode = data.code.toUpperCase();

    if (editId !== null) {
      //  UPDATE
      setDocumentTypes((prev) =>
        prev.map((doc) =>
          doc.id === editId
            ? { ...doc, name: data.name, code: upperCode }
            : doc,
        ),
      );
    } else {
      //  ADD
      const newDoc: DocumentType = {
        id: Date.now(),
        name: data.name,
        code: upperCode,
        status: "Active",
      };
      setDocumentTypes((prev) => [...prev, newDoc]);
    }

    reset();
    setEditId(null);
    setView("table");
  };

  const handleEdit = (doc: DocumentType) => {
    setEditId(doc.id);
    setValue("name", doc.name);
    setValue("code", doc.code);
    setView("form");
  };

  return (
    <div>
      <PageMeta
        title="Document Type | FMS Document Type"
        description="Manage Document Type"
      />
      <PageBreadcrumb pageTitle="Manage Document Type" />

      {/*  Toggle Buttons */}
      <div className="mb-6 flex gap-3">
        <Button
          onClick={() => {
            reset();
            setEditId(null);
            setView("table");
          }}
          variant={view === "table" ? "primary" : "outline"}
        >
          View Document Type
        </Button>

        <Button
          onClick={() => {
            reset();
            setEditId(null);
            setView("form");
          }}
          variant={view === "form" ? "primary" : "outline"}
        >
          Add Document Type
        </Button>
      </div>

      {/*  FORM */}
      {view === "form" && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <h3 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
            {editId ? "Edit Document Type" : "Add Document Type"}
          </h3>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* NAME */}
            <div>
              <Label>Document Name</Label>
              <Input
                placeholder="Enter document name"
                value={nameValue || ""}
                {...register("name", {
                  required: "Document name is required",
                  minLength: {
                    value: 2,
                    message: "Minimum 2 characters required",
                  },
                })}
                onChange={(e) =>
                  setValue("name", e.target.value.toUpperCase(), {
                    shouldValidate: true,
                  })
                }
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/*  CODE */}
            <div>
              <Label>Document Code</Label>
              <Input
                placeholder="Enter document code"
                value={codeValue || ""}
                {...register("code", {
                  required: "Document code is required",
                  minLength: {
                    value: 2,
                    message: "Minimum 2 characters required",
                  },
                })}
                onChange={(e) =>
                  setValue("code", e.target.value.toUpperCase(), {
                    shouldValidate: true,
                  })
                }
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.code.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Button disabled={!isValid}>
              {editId ? "Update Document Type" : "Save Document Type"}
            </Button>
          </div>
        </form>
      )}

      {/* TABLE */}
      {view === "table" && (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:text-amber-50 dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    ID
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    Name
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    Code
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    Status
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start">
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100">
                {documentTypes.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="px-5 py-4">{doc.id}</TableCell>
                    <TableCell className="px-5 py-4">{doc.name}</TableCell>
                    <TableCell className="px-5 py-4">{doc.code}</TableCell>
                    <TableCell className="px-5 py-4">
                      <Badge
                        size="sm"
                        color={doc.status === "Active" ? "success" : "error"}
                      >
                        {doc.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(doc)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setDocumentTypes((prev) =>
                              prev.filter((d) => d.id !== doc.id),
                            )
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
