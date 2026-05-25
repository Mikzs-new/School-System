import React, {
  useEffect,
  useMemo,
  useState
} from 'react';

import {
  Plus,
  RefreshCw,
  Save,
  Trash2
} from 'lucide-react';

import {
  createModuleRecord,
  deleteModuleRecord,
  listModule,
  updateModuleRecord
} from '../api/modules.js';

import {
  hasModuleAccess,
  hasPermission
} from '../state/permissionGuard.js';

import LoadingState from '../components/ui/LoadingState.jsx';
import StatusBanner from '../components/ui/StatusBanner.jsx';

import {
  notifyDesktop
} from '../utils/desktopNotify.js';

function getRecordId(record) {
  return record.id || record.pk;
}

function getRecordTitle(
  record,
  moduleLabel
) {

  return (
    record.name ||
    record.username ||
    record.title ||
    record.full_name ||
    record.email ||
    `${moduleLabel} #${
      getRecordId(record) || 'N/A'
    }`
  );
}

function parseJson(value) {

  try {

    return {
      data: JSON.parse(value),
      error: ''
    };

  } catch {

    return {
      data: null,
      error:
        'Enter valid JSON before submitting.'
    };
  }
}

const FORM_HELP = {

  departments: {
    required: ['name', 'school'],
    example: {
      name:
        'College of Computer Studies',
      school: 1
    }
  },

  courses: {
    required: [
      'name',
      'school',
      'department'
    ],
    example: {
      name:
        'BS Information Technology',
      school: 1,
      department: 1
    }
  },

  students: {
    required: [
      'first_name',
      'last_name',
      'school_student_id',
      'school',
      'course',
      'year_level',
      'email'
    ],
    example: {
      first_name: 'Juan',
      last_name: 'Dela Cruz',
      school_student_id:
        '2026-0001',
      school: 1,
      course: 1,
      year_level: 1,
      email:
        'student@example.com'
    }
  },

  elections: {
    required: [
      'name',
      'description',
      'start_datetime',
      'end_datetime'
    ],
    example: {
      name:
        'Student Council Election 2026',
      description:
        'Annual student election',
      start_datetime:
        '2026-05-05T08:00:00Z',
      end_datetime:
        '2026-05-06T17:00:00Z'
    }
  }
};

function getFormHelp(moduleKey) {

  return (
    FORM_HELP[moduleKey] || {
      required: [],
      example: {}
    }
  );
}

function formatPayload(value) {

  return JSON.stringify(
    value,
    null,
    2
  );
}

export default function ModuleView({
  moduleConfig,
  user,
  onRowClick
}) {

  const canRead = hasPermission(
    user,
    moduleConfig.primaryPermission
  );

  const canCreate =
    hasModuleAccess(
      user,
      moduleConfig.permissionModule,
      'create'
    );

  const canUpdate =
    hasModuleAccess(
      user,
      moduleConfig.permissionModule,
      'update'
    );

  const canDelete =
    hasModuleAccess(
      user,
      moduleConfig.permissionModule,
      'delete'
    );

  const formHelp =
    getFormHelp(
      moduleConfig.permissionModule
    );

  const [records, setRecords] =
    useState([]);

  const [selectedId, setSelectedId] =
    useState('');

  const [payload, setPayload] =
    useState(() =>
      formatPayload(formHelp.example)
    );

  const [status, setStatus] =
    useState({
      type: 'idle',
      message: ''
    });

  const [isLoading, setIsLoading] =
    useState(false);

  const selectedRecord = useMemo(
    () =>
      records.find(
        (record) =>
          String(getRecordId(record)) ===
          String(selectedId)
      ),
    [records, selectedId]
  );

  const loadRecords = async () => {

    if (!canRead) {

      setStatus({
        type: 'error',
        message: 'Access Denied'
      });

      return;
    }

    if (!moduleConfig.endpoint) {

      setRecords([]);

      setStatus({
        type: 'info',
        message:
          'No backend endpoint configured.'
      });

      return;
    }

    setIsLoading(true);

    setStatus({
      type: 'idle',
      message: ''
    });

    try {

      const data =
        await listModule(
          moduleConfig.endpoint
        );

      setRecords(data);

      setStatus({
        type: 'success',
        message:
          `Loaded ${data.length} ${moduleConfig.label.toLowerCase()} record(s).`
      });

    } catch (error) {

      setStatus({
        type: 'error',
        message: error.message
      });

    } finally {

      setIsLoading(false);
    }
  };

  useEffect(() => {

    loadRecords();

    setSelectedId('');

    setPayload(
      formatPayload(
        getFormHelp(
          moduleConfig.permissionModule
        ).example
      )
    );

  }, [
    moduleConfig.endpoint,
    moduleConfig.permissionModule
  ]);

  const handleCreate =
    async () => {

      if (!canCreate) {

        setStatus({
          type: 'error',
          message: 'Access Denied'
        });

        return;
      }

      const parsed =
        parseJson(payload);

      if (parsed.error) {

        setStatus({
          type: 'error',
          message: parsed.error
        });

        return;
      }

      try {

        await createModuleRecord(
          moduleConfig.endpoint,
          parsed.data
        );

        setStatus({
          type: 'success',
          message:
            'Record created.'
        });

        notifyDesktop(
          `${moduleConfig.label} updated`,
          'Record created successfully.'
        );

        await loadRecords();

      } catch (error) {

        setStatus({
          type: 'error',
          message: error.message
        });
      }
    };

  const handleUpdate =
    async () => {

      if (!canUpdate) {

        setStatus({
          type: 'error',
          message: 'Access Denied'
        });

        return;
      }

      if (!selectedId) {

        setStatus({
          type: 'error',
          message:
            'Select a record to update.'
        });

        return;
      }

      const parsed =
        parseJson(payload);

      if (parsed.error) {

        setStatus({
          type: 'error',
          message: parsed.error
        });

        return;
      }

      try {

        await updateModuleRecord(
          moduleConfig.endpoint,
          selectedId,
          parsed.data
        );

        setStatus({
          type: 'success',
          message:
            'Record updated.'
        });

        await loadRecords();

      } catch (error) {

        setStatus({
          type: 'error',
          message: error.message
        });
      }
    };

  const handleDelete =
    async () => {

      if (!canDelete) {

        setStatus({
          type: 'error',
          message: 'Access Denied'
        });

        return;
      }

      if (!selectedId) {

        setStatus({
          type: 'error',
          message:
            'Select a record to delete.'
        });

        return;
      }

      try {

        await deleteModuleRecord(
          moduleConfig.endpoint,
          selectedId
        );

        setSelectedId('');

        setStatus({
          type: 'success',
          message:
            'Record deleted.'
        });

        await loadRecords();

      } catch (error) {

        setStatus({
          type: 'error',
          message: error.message
        });
      }
    };

  return (

    <section className="page-stack">

      <header className="page-header">

        <div>

          <span className="eyebrow">
            MODULE
          </span>

          <h1>
            {moduleConfig.label}
          </h1>

        </div>

        <button
          className="secondary-button"
          type="button"
          onClick={loadRecords}
        >

          <RefreshCw size={17} />

          Refresh

        </button>

      </header>

      <StatusBanner type={status.type}>
        {status.message}
      </StatusBanner>

      <div className="module-layout">

        {/* RECORDS */}

        <div className="data-panel">

          <h2>
            Records
          </h2>

          {isLoading ? (
            <LoadingState
              label={`Loading ${moduleConfig.label}...`}
            />
          ) : null}

          {!isLoading &&
          records.length === 0 ? (

            <div className="empty-state">
              No records found.
            </div>

          ) : null}

          {!isLoading &&
          records.length > 0 ? (

            <div className="record-list">

              {records.map((record) => {

                const id =
                  getRecordId(record);

                return (

                  <button
                    key={id}
                    type="button"
                    className={
                      String(selectedId) ===
                      String(id)
                        ? 'record-row selected-record'
                        : 'record-row'
                    }
                    onClick={() => {

                      setSelectedId(id);

                      setPayload(
                        JSON.stringify(
                          record,
                          null,
                          2
                        )
                      );

                      onRowClick?.(record);
                    }}
                  >

                    <strong>
                      {getRecordTitle(
                        record,
                        moduleConfig.label
                      )}
                    </strong>

                    <span>
                      ID: {id}
                    </span>

                  </button>

                );
              })}

            </div>

          ) : null}

        </div>

        {/* ACTIONS */}

        <div className="data-panel">

          <h2>
            Actions
          </h2>

          <div className="field-help">

            <strong>
              Required fields:
            </strong>

            <ul>

              {formHelp.required.map(
                (field) => (
                  <li key={field}>
                    {field}
                  </li>
                )
              )}

            </ul>

            <button
              type="button"
              onClick={() =>
                setPayload(
                  formatPayload(
                    formHelp.example
                  )
                )
              }
            >
              Use Example
            </button>

          </div>

          <textarea
            className="json-editor"
            spellCheck="false"
            value={payload}
            onChange={(event) =>
              setPayload(
                event.target.value
              )
            }
          />

          <div className="action-row">

            {canCreate ? (

              <button
                className="primary-button"
                type="button"
                onClick={handleCreate}
              >

                <Plus size={17} />

                Create

              </button>

            ) : null}

            {canUpdate ? (

              <button
                className="secondary-button"
                type="button"
                onClick={handleUpdate}
              >

                <Save size={17} />

                Update

              </button>

            ) : null}

            {canDelete ? (

              <button
                className="danger-button"
                type="button"
                onClick={handleDelete}
              >

                <Trash2 size={17} />

                Delete

              </button>

            ) : null}

          </div>

        </div>

      </div>

    </section>
  );
}