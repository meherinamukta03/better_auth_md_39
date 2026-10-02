import React, { Suspense } from 'react';
import ResetPasswordForm from './reset-password-form';

const ResetPasswordPage = () => {
    return (
        <div>
            <h2>Reset password</h2>

<Suspense fallback='loading'>

<ResetPasswordForm></ResetPasswordForm>

</Suspense>




        </div>
    );
};

export default ResetPasswordPage;