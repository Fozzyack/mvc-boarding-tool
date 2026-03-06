"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import Button from "@/components/ui/Button";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import Select from "@/components/ui/Select";
import type { StaffMember } from "@/types";
import getBackendUrl from "@/utils/getBackendUrl";

type StaffFormState = {
    name: string;
    code: string;
    password: string;
    isAdmin: "true" | "false";
    isActive: "true" | "false";
};

const EMPTY_FORM: StaffFormState = {
    name: "",
    code: "",
    password: "",
    isAdmin: "false",
    isActive: "true",
};

const formatDate = (value: string): string => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "-";
    }
    return date.toLocaleDateString();
};

const StaffManagement = () => {
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [formState, setFormState] = useState<StaffFormState>(EMPTY_FORM);

    const loadStaff = async () => {
        setIsLoading(true);
        setErrorMessage(null);
        try {
            const response = await fetch(`${getBackendUrl()}/api/staff`, { method: "GET" });
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(typeof data?.msg === "string" ? data.msg : "Failed to load staff");
                setStaff([]);
                return;
            }

            setStaff(Array.isArray(data.staff) ? data.staff : []);
        } catch (error) {
            console.error("Error loading staff:", error);
            setErrorMessage("Failed to load staff");
            setStaff([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadStaff();
    }, []);

    const filteredStaff = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return staff.filter((member) => {
            const matchesQuery =
                !query ||
                [member.name, member.code, member.isAdmin ? "admin" : "staff"]
                    .join(" ")
                    .toLowerCase()
                    .includes(query);

            const matchesStatus =
                statusFilter === "all" ||
                (statusFilter === "active" && member.isActive) ||
                (statusFilter === "inactive" && !member.isActive);

            return matchesQuery && matchesStatus;
        });
    }, [searchQuery, staff, statusFilter]);

    const openCreateModal = () => {
        setEditingStaff(null);
        setFormState(EMPTY_FORM);
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsModalOpen(true);
    };

    const openEditModal = (member: StaffMember) => {
        setEditingStaff(member);
        setFormState({
            name: member.name,
            code: member.code,
            password: "",
            isAdmin: member.isAdmin ? "true" : "false",
            isActive: member.isActive ? "true" : "false",
        });
        setErrorMessage(null);
        setSuccessMessage(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        if (isSubmitting) {
            return;
        }
        setIsModalOpen(false);
        setEditingStaff(null);
        setFormState(EMPTY_FORM);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        const payload: Record<string, unknown> = {
            name: formState.name,
            code: formState.code,
            isAdmin: formState.isAdmin === "true",
        };

        if (editingStaff) {
            payload.isActive = formState.isActive === "true";
            if (formState.password.trim().length > 0) {
                payload.password = formState.password;
            }
        } else {
            payload.password = formState.password;
        }

        const endpoint = editingStaff
            ? `${getBackendUrl()}/api/staff/${editingStaff.id}`
            : `${getBackendUrl()}/api/staff`;
        const method = editingStaff ? "PATCH" : "POST";

        setIsSubmitting(true);
        try {
            const response = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    typeof data?.msg === "string" ? data.msg : "Failed to save staff member",
                );
                return;
            }

            await loadStaff();
            setIsModalOpen(false);
            setEditingStaff(null);
            setFormState(EMPTY_FORM);
            setSuccessMessage(editingStaff ? "Staff member updated" : "Staff member created");
        } catch (error) {
            console.error("Error saving staff:", error);
            setErrorMessage("Failed to save staff member");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleActive = async (member: StaffMember) => {
        const nextIsActive = !member.isActive;
        const actionLabel = nextIsActive ? "reactivate" : "deactivate";

        const confirmed = window.confirm(
            `Are you sure you want to ${actionLabel} ${member.name}?`,
        );
        if (!confirmed) {
            return;
        }

        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            const response = await fetch(`${getBackendUrl()}/api/staff/${member.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: nextIsActive }),
            });
            const data = await response.json();

            if (!response.ok) {
                setErrorMessage(
                    typeof data?.msg === "string"
                        ? data.msg
                        : `Failed to ${actionLabel} staff member`,
                );
                return;
            }

            await loadStaff();
            setSuccessMessage(`Staff member ${nextIsActive ? "reactivated" : "deactivated"}`);
        } catch (error) {
            console.error(`Error trying to ${actionLabel} staff member:`, error);
            setErrorMessage(`Failed to ${actionLabel} staff member`);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-brand">Staff Management</h2>
                    <p className="text-brand">Create, edit, and manage staff access for your clinic.</p>
                </div>
                <Button onClick={openCreateModal}>Add Staff Member</Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
                <Input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by name or code"
                    className="max-w-sm"
                    aria-label="Search staff"
                />
                <Select
                    value={statusFilter}
                    onChange={(event) =>
                        setStatusFilter(event.target.value as "all" | "active" | "inactive")
                    }
                    className="w-40"
                    aria-label="Filter by status"
                >
                    <option value="all">All status</option>
                    <option value="active">Active only</option>
                    <option value="inactive">Inactive only</option>
                </Select>
            </div>

            {errorMessage ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {errorMessage}
                </div>
            ) : null}

            {successMessage ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                    {successMessage}
                </div>
            ) : null}

            <div className="ui-card relative w-full overflow-x-auto">
                <table className="w-full table-auto text-sm">
                    <thead className="rounded-base border-b border-border bg-surface-muted text-sm text-text">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left font-medium">
                                Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left font-medium">
                                Code
                            </th>
                            <th scope="col" className="px-6 py-3 text-left font-medium">
                                Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left font-medium">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left font-medium">
                                Created
                            </th>
                            <th scope="col" className="px-6 py-3 text-left font-medium">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                                    Loading staff...
                                </td>
                            </tr>
                        ) : null}

                        {!isLoading && filteredStaff.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-text-muted">
                                    No staff members found.
                                </td>
                            </tr>
                        ) : null}

                        {!isLoading
                            ? filteredStaff.map((member) => (
                                  <tr key={member.id} className="border-b border-border">
                                      <td className="px-6 py-3 font-medium text-text">{member.name}</td>
                                      <td className="px-6 py-3 text-text-muted">{member.code}</td>
                                      <td className="px-6 py-3">
                                          <span
                                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                  member.isAdmin
                                                      ? "bg-brand/10 text-brand"
                                                      : "bg-slate-100 text-slate-700"
                                              }`}
                                          >
                                              {member.isAdmin ? "Admin" : "Staff"}
                                          </span>
                                      </td>
                                      <td className="px-6 py-3">
                                          <span
                                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                  member.isActive
                                                      ? "bg-emerald-100 text-emerald-700"
                                                      : "bg-red-100 text-red-700"
                                              }`}
                                          >
                                              {member.isActive ? "Active" : "Inactive"}
                                          </span>
                                      </td>
                                      <td className="px-6 py-3 text-text-muted">
                                          {formatDate(member.createdAt)}
                                      </td>
                                      <td className="px-6 py-3">
                                          <div className="flex flex-wrap items-center gap-2">
                                              <Button
                                                  variant="secondary"
                                                  size="sm"
                                                  onClick={() => openEditModal(member)}
                                              >
                                                  Edit
                                              </Button>
                                              <Button
                                                  variant={member.isActive ? "ghost" : "secondary"}
                                                  size="sm"
                                                  onClick={() => handleToggleActive(member)}
                                              >
                                                  {member.isActive ? "Deactivate" : "Reactivate"}
                                              </Button>
                                          </div>
                                      </td>
                                  </tr>
                              ))
                            : null}
                    </tbody>
                </table>
            </div>

            {isModalOpen ? (
                <Modal
                    title={editingStaff ? "Edit Staff Member" : "Add Staff Member"}
                    description={
                        editingStaff
                            ? "Update user details, role, status, or reset password"
                            : "Create a new staff account for this clinic"
                    }
                    onClose={closeModal}
                    contentClassName="max-w-lg"
                >
                    <form onSubmit={handleSubmit}>
                        <FormField label="Name" htmlFor="staff-name" required>
                            <Input
                                id="staff-name"
                                value={formState.name}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, name: event.target.value }))
                                }
                                placeholder="Alex Morgan"
                                required
                            />
                        </FormField>

                        <FormField label="Code" htmlFor="staff-code" required>
                            <Input
                                id="staff-code"
                                value={formState.code}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, code: event.target.value }))
                                }
                                placeholder="ALEX01"
                                required
                            />
                        </FormField>

                        <FormField
                            label={editingStaff ? "New Password" : "Password"}
                            htmlFor="staff-password"
                            required={!editingStaff}
                        >
                            <Input
                                id="staff-password"
                                type="password"
                                value={formState.password}
                                onChange={(event) =>
                                    setFormState((prev) => ({ ...prev, password: event.target.value }))
                                }
                                placeholder={editingStaff ? "Leave blank to keep current password" : "Minimum 8 characters"}
                                required={!editingStaff}
                            />
                        </FormField>

                        <FormField label="Role" htmlFor="staff-role" required>
                            <Select
                                id="staff-role"
                                value={formState.isAdmin}
                                onChange={(event) =>
                                    setFormState((prev) => ({
                                        ...prev,
                                        isAdmin: event.target.value as "true" | "false",
                                    }))
                                }
                            >
                                <option value="false">Staff</option>
                                <option value="true">Admin</option>
                            </Select>
                        </FormField>

                        {editingStaff ? (
                            <FormField label="Status" htmlFor="staff-status" required>
                                <Select
                                    id="staff-status"
                                    value={formState.isActive}
                                    onChange={(event) =>
                                        setFormState((prev) => ({
                                            ...prev,
                                            isActive: event.target.value as "true" | "false",
                                        }))
                                    }
                                >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                </Select>
                            </FormField>
                        ) : null}

                        <div className="mt-6 flex items-center justify-end gap-2">
                            <Button type="button" variant="secondary" onClick={closeModal}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting
                                    ? "Saving..."
                                    : editingStaff
                                      ? "Update Staff"
                                      : "Create Staff"}
                            </Button>
                        </div>
                    </form>
                </Modal>
            ) : null}
        </div>
    );
};

export default StaffManagement;
